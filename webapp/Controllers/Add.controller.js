sap.ui.define([
    'ibm/sd/ap/Controllers/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/m/DisplayListItem'
], function(Controller, JSONModel, MessageBox, MessageToast, Fragment, DisplayListItem) {
    'use strict';
    return Controller.extend("ibm.sd.ap.Controllers.Add",{

        onInit: function(){

            var oJSONModel = new JSONModel();
            oJSONModel.setData({
                "prodData":{
                    "PRODUCT_ID": "",
                    "TYPE_CODE": "",
                    "CATEGORY": "Notebooks",
                    "NAME": "",
                    "SUPPLIER_ID": "0100000051",
                    "SUPPLIER_NAME": "TECUM",
                    "DESCRIPTION": "",
                    "PRICE": "0.00",
                    "CURRENCY_CODE": "EUR"
                }
            });

            this.getView().setModel(oJSONModel,"zakas");

            this.oLocalModel = oJSONModel;

            this.setMode("Create");
            
        },

        onReset: function(){
            this.oLocalModel.setData({
                "prodData":{
                    "PRODUCT_ID": "",
                    "TYPE_CODE": "",
                    "CATEGORY": "Notebooks",
                    "NAME": "",
                    "SUPPLIER_ID": "0100000051",
                    "SUPPLIER_NAME": "TECUM",
                    "DESCRIPTION": "",
                    "PRICE": "0.00",
                    "CURRENCY_CODE": "EUR"
                }
            });
            this.setMode("Create");
        },

        onCreate: function(){
            var payLoad = this.oLocalModel.getProperty("/prodData")
            if (!payLoad.PRODUCT_ID || !payLoad.NAME) 
            {
                MessageBox.error("Product Id and name should not empty");
                return;
            }
            var oDataModel = this.getView().getModel();
            if(this.mode === "Create"){
                oDataModel.create("/ProductSet",payLoad,{
                    success: function(){
                        MessageToast.show("Data has been created successfully in db");
                    },
                    error: function(oError){
                        var errorMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                        MessageBox.error("Dude! Data not created in db: " + errorMessage);
                    }
                });
            }else{
                oDataModel.update("/ProductSet('" + this.prodId + "')",payLoad,{
                    success: function(){
                        MessageToast.show("Data has been updated successfully in db");
                    },
                    error: function(oError){
                        var errorMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                        MessageBox.error("Dude! Data not updated in db: " + errorMessage);
                    }
                    });
            }
            
            
        },

        onEnterProdId: function(oEvent){
            var that = this;
            this.prodId = oEvent.getSource().getValue();

            var oDataModel = this.getView().getModel();
            oDataModel.read("/ProductSet('" + this.prodId +"')",{
                success: function(data){
                    that.oLocalModel.setProperty("/prodData",data);
                    that.setMode("Update");
                },
                error: function(){
                    MessageBox.error("The product does not exist");
                }
            })
        },
        mode: "Create",
        prodId: null,
        setMode: function(sMode){
            this.mode = sMode;
            if (sMode === "Create") {
                this.getView().byId("prodId").setEnabled(true);
                this.getView().byId("idDelete").setEnabled(false);
                this.getView().byId("Create").setText("Create");
            }else{
                this.getView().byId("prodId").setEnabled(false);
                this.getView().byId("Create").setText("Update");
                this.getView().byId("idDelete").setEnabled(true);
                this.getView().byId("idName").focus();
            }

        },
        oSuplier: null,
        oField: null,
        onH4Help: function(oEvent){
            this.oField = oEvent.getSource();
            var that = this;
            if(!this.oSuplier){
                Fragment.load({
                    fragmentName: "ibm.sd.ap.Fragments.popup",
                    type: "XML",
                    id: "idSuppl",
                    controller: this
                }).then(function(oFragment){
                    
                    that.oSuplier = oFragment;
                    oFragment.setTitle("Select Supplier");
                    that.oSuplier.setMultiSelect(false);
                    that.getView().addDependent(that.oSuplier);
                    that.oSuplier.bindAggregation("items",{
                        path: "/SupplierSet",
                        template: new DisplayListItem({
                            label: "{CITY}",
                            value: "{BP_ID}"
                        })
                    });
                    oFragment.open();
                });
            }else{
                this.oSuplier.open();
            }
        },
        onConfirm: function(oEvent){
            var oSelectedItem = oEvent.getParameter("selectedItem");
            var sData = oSelectedItem.getValue();
            this.oLocalModel.setProperty("/prodData/SUPPLIER_ID", sData);
            this.oLocalModel.setProperty("/prodData/SUPPLIER_NAME", oSelectedItem.getLabel());
        },
        onGetMaxValue: function(){
            var that = this;
            var oDataModel = this.getView().getModel();
            oDataModel.callFunction("/GetMostExpensiveProduct",{
                urlParameters: {
                    "ProdCategory": this.getView().byId("category").getSelectedKey()
                },
                success: function(data){
                    that.oLocalModel.setProperty("/prodData",data);
                    that.prodId = data.PRODUCT_ID;
                    that.setMode("Update");
                }
            })
        },
        onDelete: function(){
           var oDataModel = this.getView().getModel();
           var that=this;
           oDataModel.remove("/ProductSet('" + this.prodId + "')", {
                success: function(){
                    that.onReset();
                    MessageToast.show("Data has been deleted successfully");
                },
                error: function(){
                    MessageBox.error("Dude! something wrong, data not deleted");
                }
           });
        }
    });
    
});