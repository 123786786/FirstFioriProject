sap.ui.define([
    'ibm/sd/ap/Controllers/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/routing/History',
    'sap/ui/core/Fragment',
    'sap/m/DisplayListItem',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(oController, MessageBox, MessageToast, History, Fragment, DisplayListItem, Filter, FilterOperator) {
    'use strict';
    return oController.extend("ibm.sd.ap.Controllers.View2",{
        onInit:function(){
            // this.someCommonLogic();
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("superman").attachMatched(this.onRouterChange, this);
        },

        onSupplierSelect: function(oEvent){
            var oSelectedItem = oEvent.getParameter("listItem");

            var sPath = oSelectedItem.getBindingContextPath();
            var sIndex = sPath.split("/")[sPath.split("/").length - 1];
            this.oRouter.navTo("suppl",{
                supplierId: sIndex
            });


        },

        onGoToBack: function(oEvent){
            var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				this.oRouter.navTo("spiderman", {}, true);
			}
        },

        onRouterChange: function(oEvent){
            var fruitId = oEvent.getParameter("arguments").fruitId;
            var sPath = '/' + fruitId;
            this.getView().bindElement(sPath,{
                expand: 'To_Supplier'
            });

            var oImage = this.getView().byId("idImg");
            var servicePath = this.getOwnerComponent().getManifestEntry("sap.app").dataSources.anubhavService.uri;
            var sProdId = fruitId.split("'")[1];
            servicePath = servicePath + "ProductImgSet('" + sProdId +"')/$value";
            oImage.setSrc(servicePath);
        },
        oSuplierPopup: null,
        onFilterSupplier: function(oEvent){
            var that= this;
            if(!this.oSuplierPopup){
                Fragment.load({
                    fragmentName: "ibm.sd.ap.Fragments.popup",
                    type: "XML",
                    id: "supplier",
                    controller: this
                }).then(function(oFragment){
                    that.oSuplierPopup = oFragment;
                    oFragment.setTitle("Suppliers");
                    that.getView().addDependent(that.oSuplierPopup);
                    that.oSuplierPopup.bindAggregation("items",{
                        path: "/suppliers",
                        template: new DisplayListItem({
                            label: "{name}",
                            value: "{city}"
                        })
                    });
                    oFragment.open();
                });
            }else{
                this.oSuplierPopup.open();
            }
            
        },
        oCityPopup: null,
        oField: null,
        onF4Help: function(oEvent){
            this.oField = oEvent.getSource();
            var that = this;
            if(!this.oCityPopup){
                Fragment.load({
                    fragmentName: "ibm.sd.ap.Fragments.popup",
                    type: "XML",
                    id: "city",
                    controller: this
                }).then(function(oFragment){
                    
                    that.oCityPopup = oFragment;
                    oFragment.setTitle("City");
                    that.oCityPopup.setMultiSelect(false);
                    that.getView().addDependent(that.oCityPopup);
                    that.oCityPopup.bindAggregation("items",{
                        path: "/cities",
                        template: new DisplayListItem({
                            label: "{name}",
                            value: "{famousFor}"
                        })
                    });
                    oFragment.open();
                });
            }else{
                this.oCityPopup.open();
            }
            
        },
       
        onConfirm: function(oEvent){
            var oSelectedItem = oEvent.getParameter("selectedItem");
            var sData = oSelectedItem.getLabel();
            var sId = oEvent.getSource().getId();
            if(sId.indexOf("city") != -1){
                this.oField.setValue(sData);
            }else{
                var aSelectedItems = oEvent.getParameter("selectedItems");
                var aFilter = [];
                for (let index = 0; index < aSelectedItems.length; index++) {
                    const element = aSelectedItems[index];
                    aFilter.push(new Filter("name", FilterOperator.EQ, element.getLabel()));
                }
                var oFilter = new Filter({
                    filters: aFilter,
                    and: false
                });
                var oTable = this.getView().byId("idTab");
                oTable.getBinding("items").filter(oFilter);
            }           
        },

        onSearchPopup: function(oEvent){
            var sValueToBeSerarch = oEvent.getParameter("value");
            var oFilter = new Filter("name",FilterOperator.Contains, sValueToBeSerarch);
            var oPopup = oEvent.getSource();
            oPopup.getBinding("items").filter(oFilter);
        },

       onSave: function(){
            var oResource = this.getView().getModel("i18n");
            var oResourceBundle = oResource.getResourceBundle();
             MessageBox.confirm("Do you want to proceed?",{
                onClose: function(status){
                    if(status === "OK"){
                        var msgText = oResourceBundle.getText("XMSG_SUCCESS", ["5555"])
                        MessageToast.show(msgText);
                    }else{
                        var msgError = oResourceBundle.getText("XMSG_ERROR")
                        MessageBox.error(msgError);
                    }
                }
             });
       }
    });
    
});