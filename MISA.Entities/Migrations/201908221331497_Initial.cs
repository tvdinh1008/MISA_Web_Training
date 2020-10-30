namespace MISA.Entities.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Refs",
                c => new
                    {
                        RefID = c.Guid(nullable: false, identity: true,defaultValueSql:"newid()"),
                        RefNo = c.String(nullable: false),
                        BirthDay = c.DateTime(nullable: false),
                        Name = c.String(nullable: false),
                        NameCompany = c.String(),
                        RefTax = c.String(),
                        Address = c.String(),
                        PhoneNb = c.String(nullable: false),
                        Email = c.String(),
                        RefType = c.String(),
                        Rank = c.String(),
                        Debt = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Note = c.String(),
                        MembF = c.String(),
                        Status = c.String(),
                    })
                .PrimaryKey(t => t.RefID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Refs");
        }
    }
}
