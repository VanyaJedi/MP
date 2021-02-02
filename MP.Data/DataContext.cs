using MP.Core.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MP.Data
{   
    public class DataContext : IdentityDbContext<AppUser>
    {
        public override DbSet<AppUser>  Users { get; set; }
        public DbSet<ChatRoom> ChatRooms { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DataContext(DbContextOptions<DataContext> options) : base(options) {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ChatRoomUser>()
                .HasKey(t => new { t.ChatRoomId, t.UserId });

            modelBuilder.Entity<ChatRoomUser>()
                .HasOne(sc => sc.ChatRoom)
                .WithMany(s => s.ChatRoomUser)
                .HasForeignKey(sc => sc.ChatRoomId);

            modelBuilder.Entity<ChatRoomUser>()
                .HasOne(sc => sc.User)
                .WithMany(c => c.ChatRoomUser)
                .HasForeignKey(sc => sc.UserId);
                
        }

    }
}