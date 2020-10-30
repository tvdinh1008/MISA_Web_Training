using MISA.DL;
using MISA.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.BL
{
    public class RefBL
    {
        private RefDL _refDL = new RefDL();

        //hàm phân trang
        //phân trang pageIndex:trang số bao nhiêu .pageSize: bao nhiêu bản ghi trong 1 trang
        public IEnumerable<Ref> getDataPaging(int pageIndex,int pageSize)
        {
            var refs = _refDL.getData();
            //OrderBy sắp xếp theo chiều tăng dần theo tham số ta truyền vào RefID . OrderByDescending sắp xếp theo chiều giảm dần
            refs = refs.OrderBy(p => p.RefID)
                .Skip((pageIndex - 1) * pageSize) //bỏ qua bao nhiêu phần tử
                .Take(pageSize);//lấy bao nhiêu phần tử
            return refs;
        }

        //Hàm tìm kiếm 
        //searchValue: refno, reftype, name ,...  searchType có các giá trị ở value input để ta xác định nó là trường nào trong th

        public IEnumerable<Ref> FilterData(int searchType,string searchValue )
        {
            var refs = _refDL.getData();
            switch(searchType)
            {
                case 0:refs = refs.Where(p => p.RefID == Guid.Parse(searchValue));
                    break;
                case 1:
                    //refs = refs.Where(p => p.RefNo == searchValue);//hàm tìm kiếm chính xác
                    refs = refs.Where(p => p.RefNo.Contains(searchValue));//hàm tìm kiếm gần đúng
                    break;
                case 2:
                    refs = refs.Where(p => p.Name.Contains(searchValue));
                    break;
                case 3:
                    refs = refs.Where(p => p.NameCompany.Contains(searchValue));
                    break;
                case 4:
                    refs = refs.Where(p => p.RefTax.Contains(searchValue));
                    break;
                case 5:
                    refs = refs.Where(p => p.Address.Contains(searchValue));
                    break;
                case 6:
                    refs = refs.Where(p => p.PhoneNb.Contains(searchValue));
                    break;
                case 7:
                    refs = refs.Where(p => p.Email.Contains(searchValue));
                    break;
                case 8:
                    refs = refs.Where(p => p.RefType.Contains(searchValue));
                    break;
                case 9:
                    refs = refs.Where(p => p.Rank.Contains(searchValue));
                    break;
                case 10:
                    refs = refs.Where(p => p.Debt==Decimal.Parse(searchValue));//tìm kiếm chính xác . phải ép kiểu do searchValue là kiểu string
                    break;
                case 11:
                    refs = refs.Where(p => p.Note.Contains(searchValue));
                    break;              
            }
            return refs;
        }
             

    }
}
