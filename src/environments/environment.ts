/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const ecount_ws_url: string = 'http://localhost:8080';
export const environment = {
  production: false,
  create_customer_supplier_path: ecount_ws_url + "/custsupp/create",
  update_customer_supplier_path: ecount_ws_url +"/custsupp/update",
  get_customer_supplier_path: ecount_ws_url  + "/custsupp/getall?",
  get_customer_supplier_byid :ecount_ws_url + "/custsupp/get?",
  delete_customer_supplier : ecount_ws_url + "/custsupp/delete",

  get_coa_path: ecount_ws_url  + "/coa/getall?",
  get_coa_drop_down_path: ecount_ws_url  + "/coa/getdd",
  create_coa_path: ecount_ws_url + "/coa/create",
  update_coa_path: ecount_ws_url +"/coa/update",
  delete_coa_path: ecount_ws_url +"/coa/delete?",

  get_so_group_stage_path: ecount_ws_url +"/so/dashboard",
  get_so_all_path: ecount_ws_url +"/so/search?",
  update_so_stage_path:ecount_ws_url +"/so/update_stg",
  create_so_path: ecount_ws_url  + "/so/create",
  init_so_path: ecount_ws_url + "/so/init",

  get_po_group_stage_path: ecount_ws_url +"/po/dashboard",
  get_po_all_path: ecount_ws_url +"/po/search?",
  update_po_stage_path:ecount_ws_url +"/po/update_stg",
  create_po_path: ecount_ws_url  + "/po/create",
  init_po_path: ecount_ws_url + "/po/init",

  currency:"USD",
 
};
