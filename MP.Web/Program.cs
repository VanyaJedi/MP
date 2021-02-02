using System;
using MP.Core.Domain;
using MP.Data;
using MP.Application.Services.Messages.ChatManager;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Linq;
namespace mp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

               using (var scope = host.Services.CreateScope())
               {
                  var services = scope.ServiceProvider;
                  try
                  {
                     var chatManager = services.GetRequiredService<IChatManager>();
                     var context = services.GetRequiredService<DataContext>();
                     var userManager = services.GetRequiredService<UserManager<AppUser>>();
                     context.Database.Migrate();
                    if (!userManager.Users.Any())
                    { 
                        DataSeed.SeedDataAsync(context, userManager).Wait();

                        chatManager.AddUserToContacts("User1", "User2");
                        chatManager.AddUserToContacts("User1", "User3");
                        chatManager.AddUserToContacts("User2", "User3");
                        chatManager.AddUserToContacts("123qwe", "User3");
                        chatManager.AddUserToContacts("User2", "123qwe");
                        chatManager.AddUserToContacts("User3", "123qwe");
                    }
                  }
                  catch (Exception ex)
                  {
                      var logger = services.GetRequiredService<ILogger<Program>>();
                      logger.LogError(ex, "An error occured during migration");
                  }
               } 

              host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
