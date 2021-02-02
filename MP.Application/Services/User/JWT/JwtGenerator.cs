using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MP.Core.Domain;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MP.Application.Services.User.JWT
{
    public class JwtGenerator: IJwtGenerator
    {
		readonly SymmetricSecurityKey _key;
		IConfiguration _config;
		public JwtGenerator(IConfiguration config)
		{
			_key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
			_config = config;
		}

		public string CreateToken(Core.Domain.AppUser user)
		{
			var claims = new List<Claim> {
				new Claim(ClaimTypes.Name, user.UserName),
				new Claim(JwtRegisteredClaimNames.NameId, user.UserName)
			};


			var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Issuer = _config["jwtTokenConfig:Issuer"],
				Subject = new ClaimsIdentity(claims),
				Expires = DateTime.Now.AddDays(7),
				SigningCredentials = credentials
			};
			var tokenHandler = new JwtSecurityTokenHandler();

			var token = tokenHandler.CreateToken(tokenDescriptor);

			return tokenHandler.WriteToken(token);
		}
	}
}
