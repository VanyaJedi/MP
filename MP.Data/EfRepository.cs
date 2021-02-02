using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using MP.Core;
using MP.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MP.Data
{
    public partial class EfRepository<T> : IRepository<T> where T : class
    {

        private DataContext _context;
        private readonly DbSet<T> _entities;

        public EfRepository(DataContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _entities = context.Set<T>();
        }


        protected virtual DbSet<T> Entity => _entities;

        /// <summary>
        /// Gets an entity
        /// </summary>
        public IQueryable<T> Table => Entity;


    }
}
