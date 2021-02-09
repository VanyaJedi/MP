using Microsoft.EntityFrameworkCore.Metadata;
using MP.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MP.Data.Interfaces
{
    public interface IRepository<T> where T : class
    {

        IQueryable<T> Table { get; }

        T GetById(string id);

        T GetById(int id);

    }
}
