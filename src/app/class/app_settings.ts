export class AppSettings{
  static getSalesOrderByStage<T>(getSalesOrderByStage: any): any {
    throw new Error("Method not implemented.");
  }
    public static fotuna_ws_url = "http://localhost:8080";
    public static create_customer_supplier_path = AppSettings.getEcountWSURL() + "/custsupp/create";
    public static update_customer_supplier_path = AppSettings.getEcountWSURL() +"/custsupp/update";
    public static get_customer_supplier_path = AppSettings.getEcountWSURL() + "/custsupp/getall?";
    public static get_customer_supplier_byid =AppSettings.getEcountWSURL() + "/custsupp/get?";
    public static delete_customer_supplier =AppSettings.getEcountWSURL() + "/custsupp/delete";

    public static get_coa_path = AppSettings.getEcountWSURL() + "/coa/getall?";
    public static get_coa_drop_down_path = AppSettings.getEcountWSURL() + "/coa/getdd";
    public static create_coa_path = AppSettings.getEcountWSURL() + "/coa/create";
    public static update_coa_path = AppSettings.getEcountWSURL()+"/coa/update";
    public static delete_coa_path = AppSettings.getEcountWSURL()+"/coa/delete?";

    public static get_so_group_stage= AppSettings.getEcountWSURL()+"/so/dashboard";
    public static get_so_all= AppSettings.getEcountWSURL()+"/so/search?";
    public static update_so_stage= AppSettings.getEcountWSURL()+"/so/update_stg"


    private static getEcountWSURL() {
        return this.fotuna_ws_url;
    }
}