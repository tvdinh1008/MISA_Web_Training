using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using MISA.BL;
using MISA.DL;
using MISA.Entities;
using MISA.WDT02.TVDINH.Models;

namespace MISA.WDT02.TVDINH.Controllers
{
    public class RefsController : ApiController
    {
        private RefDL _refDL = new RefDL();
        private RefBL _refBL = new RefBL();

        //lấy tất cả dữ liệu từ database
        [Route("refs")]
        [HttpGet]
        public AjaxResult getData()
        {
            AjaxResult _ajaxResult = new AjaxResult();
            try
            {
                _ajaxResult.Data = _refDL.getData();
            }
            catch (Exception ex)
            {
                _ajaxResult.Data = ex;
                _ajaxResult.Success = false;
                _ajaxResult.Message = "hệ thống đang lỗi";
            }
            return _ajaxResult;
        }
        //lọc dữ liệu theo tham số truyền vào
        [Route("refs/filtering/{searchType}/{searchValue}")]
        [HttpGet]
        public AjaxResult getDataFilter([FromUri] int searchType,string searchValue)
        {
            AjaxResult _ajaxResult = new AjaxResult();
            try
            {
                _ajaxResult.Data = _refBL.FilterData(searchType,searchValue);
            }
            catch (Exception ex)
            {
                _ajaxResult.Data = ex;
                _ajaxResult.Success = false;
                _ajaxResult.Message = "hệ thống đang lỗi";
            }
            return _ajaxResult;
        }

        //lấy tất cả dữ liệu từ database theo phân trang
        [Route("refs/{pageIndex}/{pageSize}")]
        [HttpGet]
        public async Task<AjaxResult> getDatabasePaging(int pageIndex,int pageSize)
        {
            await  Task.Delay(500); // để cho nó chậm 2s cho thấy đc con quay
            AjaxResult _ajaxResult = new AjaxResult();
            try
            {
                _ajaxResult.Data = _refBL.getDataPaging(pageIndex, pageSize);
            }
            catch (Exception ex)
            {
                _ajaxResult.Data = ex;
                _ajaxResult.Success = false;
                _ajaxResult.Message = "hệ thống đang lỗi";
            }
            return _ajaxResult;

        }





        //xóa nhiều dữ liệu khi tích
        [Route("refs")]
        [HttpDelete]
        public AjaxResult deleteMultiple([FromBody] List<Guid> refids)
        {
            AjaxResult _ajaxResult = new AjaxResult();
            try
            {
                _refDL.deleteMultiple(refids);
            }
            catch (Exception ex)
            {
                _ajaxResult.Data = ex;
                _ajaxResult.Success = false;
                _ajaxResult.Message = "hệ thống đang lỗi";
            }
            return _ajaxResult;
        }
        //tạo 1 đối tượng mới FromBody thì ko cần _ref trên Route
        [Route("refs")]
        [HttpPost]
        public AjaxResult Post([FromBody] Ref _ref)
        {

            AjaxResult _ajaxResult = new AjaxResult();
            try
            {
                _refDL.addRef(_ref);
            }
            catch (Exception ex)
            {
                _ajaxResult.Data = ex;
                _ajaxResult.Success = false;
                _ajaxResult.Message = "hệ thống đang lỗi";
            }
            return _ajaxResult;
        }
        //sửa 1 đối tượng
        [Route("refs")]
        [HttpPut]
        public AjaxResult Put([FromBody] Ref _ref)
        {
            AjaxResult _ajaxResult = new AjaxResult();
            try
            {
                _refDL.editRef(_ref);
            }
            catch (Exception ex)
            {
                _ajaxResult.Data = ex;
                _ajaxResult.Success = false;
                _ajaxResult.Message = "hệ thống đang lỗi";
            }
            return _ajaxResult;
        }

    }
}