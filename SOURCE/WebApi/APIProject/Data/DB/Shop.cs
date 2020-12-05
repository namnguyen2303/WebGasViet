//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Data.DB
{
    using System;
    using System.Collections.Generic;
    
    public partial class Shop
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Shop()
        {
            this.Customers = new HashSet<Customer>();
            this.Customers1 = new HashSet<Customer>();
            this.ShopImages = new HashSet<ShopImage>();
        }
    
        public int ID { get; set; }
        public string Name { get; set; }
        public int ProvinceID { get; set; }
        public Nullable<int> DistrictID { get; set; }
        public string Address { get; set; }
        public double Lati { get; set; }
        public double Long { get; set; }
        public string PlusCode { get; set; }
        public string ContactName { get; set; }
        public string ContactPhone { get; set; }
        public Nullable<int> AgentID { get; set; }
        public Nullable<System.DateTime> CraeteDate { get; set; }
        public int IsActive { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Customer> Customers { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Customer> Customers1 { get; set; }
        public virtual District District { get; set; }
        public virtual Province Province { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ShopImage> ShopImages { get; set; }
    }
}