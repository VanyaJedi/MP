using MP.Core.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace MP.Data
{   
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext()
        {
        }

        /*public DataContext(DbContextOptions options) : base(options)
        {
        }*/

        public override DbSet<AppUser>  Users { get; set; }
        public DbSet<ChatRoom> ChatRooms { get; set; }
        public DbSet<Message> Messages { get; set; }
        public IConfiguration Configuration { get; }
        public DataContext(DbContextOptions<DataContext> options, IConfiguration configuraion) : base(options) {
            Configuration = configuraion;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            if (!options.IsConfigured)
            {
                options.UseSqlServer(Configuration["connections:development"]);
            }
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