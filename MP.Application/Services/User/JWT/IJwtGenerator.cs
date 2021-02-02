using MP.Core.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace MP.Application.Services.User.JWT
{
    public interface IJwtGenerator
    {
        string CreateToken(Core.Domain.AppUser user);
    }
}
