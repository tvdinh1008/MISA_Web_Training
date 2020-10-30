using MISA.Entities;
using MISA.WDT02.TVDINH.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.DL
{
    public class RefDL
    {
        //tầng này sẽ thao tác với database thêm sửa xóa , lấy dữ liệu ra
        private MISAWDT02TVDINHContext db = new MISAWDT02TVDINHContext();

        //lấy tất cả dữ liệu từ database       
        public IEnumerable<Ref> getData() //hoặc IQueryable
        {
            return db.Refs;
        }
        //hàm xóa nhiều 
        public void deleteMultiple(List<Guid> _refids)
        {
            foreach (var refid in _refids)
            {
                var refitem = db.Refs.Where(p => p.RefID == refid).FirstOrDefault();
                db.Refs.Remove(refitem);
            }
            db.SaveChanges();
        }
        //hàm thêm mới 1 đối tượng
        public void addRef(Ref _ref)
        {
            _ref.RefID = Guid.NewGuid(); //tự tạo 1 id mới
            db.Refs.Add(_ref);
            db.SaveChanges();
        }
        //hàm sửa 1 đối tượng(tìm theo ID mà mỗi đối tượng có 1ID duy nhất
        public void editRef(Ref _ref)
        {
            var refItem = db.Refs.Where(p => p.RefID == _ref.RefID).FirstOrDefault();
            refItem.RefNo = _ref.RefNo;
            refItem.BirthDay = _ref.BirthDay;
            refItem.Name = _ref.Name;
            refItem.RefType = _ref.RefType;
            refItem.PhoneNb = _ref.PhoneNb;
            refItem.NameCompany = _ref.NameCompany;
            refItem.RefTax = _ref.RefTax;
            refItem.Email = _ref.Email;
            refItem.Address = _ref.Address;
            refItem.Note = _ref.Note;
            db.SaveChanges();
        }
    }
}
