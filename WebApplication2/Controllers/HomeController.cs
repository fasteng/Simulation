using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Mvc.Ajax;

namespace WebApplication2.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult UploadFile()
        {
            string _modelname = string.Empty;
            string json = "";
            if (System.Web.HttpContext.Current.Request.Files.AllKeys.Any())
            {
                var model = System.Web.HttpContext.Current.Request.Files["Model"];
                if (model.ContentLength > 0)
                {
                    var fileName = Path.GetFileName(model.FileName);
                    var _ext = Path.GetExtension(model.FileName);

                    _modelname = Guid.NewGuid().ToString();
                    var _comPath = Server.MapPath("/MyFolder") + _modelname + _ext;
                    _modelname = "model_" + _modelname + _ext;

                    //ViewBag.Msg = _comPath;
                    var path = _comPath;
                    //tblAssignment assign = new tblAssignment();
                    //assign.Uploaded_Path = "/MyFolder" + _imgname + _ext;
                    // Saving Image in Original Mode
                    //model.SaveAs("/asd.json");
                    json = new StreamReader(model.InputStream).ReadToEnd();
                }
            }
            Response.Clear();
            Response.ContentType = "application/json; charset=utf-8";
            Response.Write(json);
            Response.End();
            return View();
        }
    }
}
