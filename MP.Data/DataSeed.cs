using MP.Core.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace MP.Data
{
    public class DataSeed
    {
        public static async Task SeedDataAsync(DataContext context, UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                                {
                                    new AppUser
                                        {
                                            DisplayName = "User1",
                                            UserName = "User1",
                                            Email = "User1@test.com"
                                        },

                                    new AppUser
                                        {
                                            DisplayName = "User2",
                                            UserName = "User2",
                                            Email = "User2@test.com"
                                        },

                                    new AppUser
                                        {
                                            DisplayName = "User3",
                                            UserName = "User3",
                                            Email = "User3@test.com"
                                        }
                                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "User123!");
                }
            }
        }
    }
}