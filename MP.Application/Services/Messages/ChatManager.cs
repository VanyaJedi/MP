using System;
using System.Collections.Generic;
using System.Linq;
using MP.Data;
using MP.Core.Domain;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using Microsoft.EntityFrameworkCore;
using MP.Application.Models.Messages;
using MP.Data.Interfaces;

namespace MP.Application.Services.Messages.ChatManager
{
    // Менеджер чата сообщений
    public class ChatManager: IChatManager
    {
        private DataContext FDB;
        private readonly IRepository<AppUser> _usersRepository;
        private readonly IRepository<Message> _messagesRepository;
        private readonly IRepository<ChatRoom> _chatRoomRepositary;
        public ChatManager(
            DataContext ADB, 
            IRepository<AppUser> usersRepository, 
            IRepository<Message> messagesRepository,
            IRepository<ChatRoom> chatRoomRepositary
        )
        {
            FDB = ADB;
            _usersRepository = usersRepository;
            _messagesRepository = messagesRepository;
            _chatRoomRepositary = chatRoomRepositary;
        }

        // Построить список контактов
        public  List<ContactItem> BuildContactList(string userName)
        {
            List<ContactItem> сontactList = new List<ContactItem>();
            var сontacts = _usersRepository.Table
                .Include(c => c.ChatRoomUser)
                .ThenInclude(sc => sc.ChatRoom)
                .ToList();

            var user = сontacts.FirstOrDefault(t => userName == t.UserName);
            if (user == null)
                return сontactList;

            var chatRooms = user.ChatRoomUser.Select(sc => sc.ChatRoom).ToList();

            // Формировать список контактов
            foreach (ChatRoom cru in chatRooms)
            {
                if (cru.UserNumber <= 2)
                    foreach (ChatRoomUser x in cru.ChatRoomUser)
                    {                     
                        if (x.User.UserName != userName)
                        {
                            ContactItem contactItem = new ContactItem();
                            contactItem.UserName = x.User.UserName;
                            contactItem.LastMessage = GetLatest(cru.Id, out contactItem.LastDateTime);
                            contactItem.ChatRoomId = cru.Id;
                            contactItem.Photo = x.User.Photo;
                            сontactList.Add(contactItem);
                            break;
                        }
                    }
                else
                {
                    ContactItem contactItem = new ContactItem();
                    contactItem.UserName = cru.ChatRoomName;
                    contactItem.LastMessage = "";
                    contactItem.Photo = null;
                    сontactList.Add(contactItem);
                }
             }

            return сontactList;
        }

        // Получить сообщения из БД для AChatRoom. AMyLogin нужен для формирования признака IsFriend.
        public  List<MessageItem> RecieveMessages(string userName, int chatRoomId)
        {
            string chatRoomName = this._chatRoomRepositary.Table.FirstOrDefault(cr => cr.Id == chatRoomId).ChatRoomName;
            List<MessageItem> result = new List<MessageItem>();
            try
            {
                var xMessages = this._messagesRepository.Table.OrderBy(p => p.MessageId);
                List<Message> messageList = (from message in xMessages
                                          where message.ChatRoomId == chatRoomId
                                             select message).ToList();
                if (messageList != null)
                {
                    int messageCountToShow = (messageList.Count > 5) ? messageList.Count - 5 : 0;
       
                    for (int i = messageCountToShow; i < messageList.Count; i++)
                    {
                        var currentUserName = _usersRepository.Table.FirstOrDefault(u => u.Id == messageList[i].UserId).UserName;
                        MessageItem xMessageItem = new MessageItem();
                        xMessageItem.MessageId = messageList[i].MessageId;
                        xMessageItem.ChatRoomName = chatRoomName;
                        xMessageItem.MessageText = messageList[i].MessageText;
                        xMessageItem.UserId = messageList[i].UserId;
                        xMessageItem.UserName = currentUserName;
                        xMessageItem.DateTime = messageList[i].SendTime; 
                        result.Add(xMessageItem);
                    }
                }

                return result;
            }
            catch
            {
                return result;
            }
        }

        // Получить последнее сообщение для AChatRoom. 
        public string GetLatest(int chatRoomId, out DateTime ASendDateTime)
        {
            List<Message> xMessageList = (from message in FDB.Messages
                                             where message.ChatRoomId == chatRoomId
                                             select message).ToList();
            if (xMessageList.Count > 0)
            {
                ASendDateTime = xMessageList[xMessageList.Count - 1].SendTime;
                string xVal = xMessageList[xMessageList.Count - 1].MessageText;
                return xVal;
            }
            else
            {
                ASendDateTime = new DateTime(1, 1, 1, 0, 0, 0);
                return "";
            }
        }

        public bool AddUserToContacts(string ALogin, string ANewUser)
        {
            bool xIsContact = false;
            // Это классический вариант загрузки связанных данных (моя оптимизация оказалась неверной)
            var xContacts = FDB.Users.Include(c => c.ChatRoomUser).ThenInclude(sc => sc.ChatRoom).ToList();
            if (xContacts.Count == 0)
                return false;
            // Выбор пользователя с заданным Login
            var u = xContacts.FirstOrDefault(t => ALogin == t.UserName);
            if (u == null)
                return false;
            // Список ChatRoom для текущего пользователя
            var cr = u.ChatRoomUser.Select(sc => sc.ChatRoom).ToList();


            // Есть ли уже такой контакт?
            foreach (ChatRoom cru in cr)
            { 
                foreach (ChatRoomUser x in cru.ChatRoomUser)
                    if (x.User.UserName == ANewUser)
                    {
                        xIsContact = true;
                        break;
                    }
                if (xIsContact)
                    break;
            }
            if (!xIsContact)
            {  
                // Здесь добавляем контакт
                var xTarget = FDB.Users.Where(p => p.UserName == ANewUser).Include(c => c.ChatRoomUser).ThenInclude(sc => sc.ChatRoom).ToList();
                if (xTarget.Count > 0)
                {
                    ChatRoom xChatRoom = new ChatRoom { ChatRoomName = ALogin + "_" + ANewUser, UserNumber = 2 };
                    FDB.ChatRooms.Add(xChatRoom);
                    xChatRoom.ChatRoomUser.Add(new ChatRoomUser { UserId = u.Id, ChatRoomId = xChatRoom.Id });
                    xChatRoom.ChatRoomUser.Add(new ChatRoomUser { UserId = xTarget[0].Id, ChatRoomId = xChatRoom.Id });
                    FDB.SaveChanges();
                    return true;
                }
                else
                    return false;
            }
            else
               return false;
        }

        // Сохранить сообщение в БД
        public bool AddMessageToPool(string message, string userName, int chatRoomId)
        {
            Message messageItem = new Message();

            var userId = this._usersRepository.Table.FirstOrDefault(u => u.UserName == userName).Id;

            messageItem.MessageText = message;
            messageItem.UserId = userId;
            messageItem.ChatRoomId = chatRoomId;
            messageItem.SendTime = DateTime.Now;
            FDB.Messages.Add(messageItem);
            FDB.SaveChanges();
            return true;
        }

        // Текущая информация при загрузке страницы
       /* public InitialDataItem GetInitialData(string ALogin)
        {
            // Это классический вариант загрузки связанных данных
            var xContacts = FDB.Users.Include(c => c.ChatRoomUser).ThenInclude(sc => sc.ChatRoom).ToList();
            // Выбор пользователя с заданным Login
            var u = xContacts.FirstOrDefault(t => ALogin == t.UserName);
            // Список ChatRoom для текущего пользователя
            var cr = u.ChatRoomUser.Select(sc => sc.ChatRoom).ToList();

            // Формировать список контактов
            List<ContactItem> xContactList = new List<ContactItem>();
            foreach (ChatRoom cru in cr)
            {
                if (cru.UserNumber <= 2)
                    foreach (ChatRoomUser x in cru.ChatRoomUser)
                    {
                        if (x.User.UserName != ALogin)
                        {
                            ContactItem xContactItem = new ContactItem();
                            xContactItem.FLogin = x.User.UserName;
                            xContactItem.FLastMessage = GetLatest(cru.Id, out xContactItem.FLastDateTime);
                            xContactItem.FChatRoom = cru.Id;
                            xContactItem.FPhoto = x.User.Photo;
                            xContactList.Add(xContactItem);
                            break;
                        }
                    }
            }
            xContactList.Sort();
            InitialDataItem xInitialDataItem = new InitialDataItem();
            xInitialDataItem.FMyLogin = ALogin;
            xInitialDataItem.FPhoto = u.Photo;
            xInitialDataItem.ContactItems = xContactList;
            return xInitialDataItem;
        }*/

        public byte[] CroppedPicture(string AFileName, int AX, int AY, int AW, int AH)
          {
              byte[] xSource = null;
              using (BinaryReader reader = new BinaryReader(File.Open(AFileName, FileMode.Open)))
               {
                    FileInfo file = new FileInfo(AFileName);
                    long size = file.Length;
                    xSource = reader.ReadBytes((int)size);



                    MemoryStream ms = new MemoryStream(xSource);
                    Image inputfile = Image.FromStream(ms);
                    if ((AW == 0) && (AH == 0))
                    {
                        AW = inputfile.Width;
                        AH = inputfile.Height;
                    }
                    Rectangle cropcoordinate = new Rectangle(Convert.ToInt32(AX), Convert.ToInt32(AY), Convert.ToInt32(AW), Convert.ToInt32(AH));
                    Bitmap bitmap = new Bitmap(cropcoordinate.Width, cropcoordinate.Height, inputfile.PixelFormat);
                    Graphics graphicsIn = Graphics.FromImage(bitmap);
                    graphicsIn.DrawImage(inputfile, new Rectangle(0, 0, bitmap.Width, bitmap.Height), cropcoordinate, GraphicsUnit.Pixel);
                    MemoryStream msmid = new MemoryStream();
                    bitmap.Save(msmid, System.Drawing.Imaging.ImageFormat.Jpeg);
                    Image mid = Image.FromStream(msmid);

                    int width, height;
                    width = 100;
                    height = 100;
                    var resized = new Bitmap(width, height);
                    using (var graphics = Graphics.FromImage(resized))
                    {
                        graphics.CompositingQuality = CompositingQuality.HighSpeed;
                        graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        graphics.CompositingMode = CompositingMode.SourceCopy;
                        graphics.DrawImage(mid, 0, 0, width, height);
                    }
                    MemoryStream ms1 = new MemoryStream();
                    resized.Save(ms1, System.Drawing.Imaging.ImageFormat.Jpeg);
                    return ms1.ToArray();
               } 
          }

        public void SaveBytes(Byte[] AIn, string AFileName)
        {
            using (BinaryWriter writer = new BinaryWriter(File.Open(AFileName, FileMode.Create)))
            {
                if (AIn != null)
                    writer.Write(AIn);
            }
        }
    }
}
