using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.Entities
{
    public class Ref
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid RefID { get; set; }
        //
        public string RefNo { get; set; }
        //
        public DateTime BirthDay { get; set; }
        public string Name { get; set; }
        //
        public string NameCompany { get; set; }
        //mã thuế
        public string RefTax { get; set; }
        //
        public string Address { get; set; }
        //
        public string PhoneNb { get; set; }
        //
        public string Email { get; set; }
        // mã thẻ thành viên
        public string RefType { get; set; }
        //
        public string Rank { get; set; }
        //số tiền nợ
        public decimal Debt { get; set; }
        //ghi chú
        public string Note { get; set; }
        //thành viên 5foot
        public string MembF { get; set; }

        //ngừng theo dõi?
        public string Status { get; set; }
    }
}
