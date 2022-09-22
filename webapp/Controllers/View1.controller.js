sap.ui.define([
    'ibm/sd/ap/Controllers/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(oController, Filter, FilterOperator) {
    'use strict';
    return oController.extend("ibm.sd.ap.Controllers.View1",{

        onInit: function(){
            //Get the router object from component.js
            this.oRouter = this.getOwnerComponent().getRouter();
        },

        onGoTo: function(fruitIndex){
            this.oRouter.navTo("superman", {
                fruitId: fruitIndex
            });
            //Get the parent object
            // var oAppCon = this.getView().getParent();
            // //Go to the next page
            // oAppCon.to("idView2");
        },

        onListItemSelect: function(oEvent){
            //Get the item selected by the user
            var oSelectedItem = oEvent.getParameter("listItem");
            //Path of the element of the selected item
            var sPath = oSelectedItem.getBindingContextPath();
            //Get the view2 object
            // var oSplitApp = this.getView().getParent().getParent();
            // var oView2 = oSplitApp.getDetailPages()[0];
            // //Bind the element of selected item to view2- element binding
            // oView2.bindElement(sPath);
            var sIndex = sPath.split("/")[sPath.split("/").length - 1]; 
            this.onGoTo(sIndex);
        },

        onSearch: function(oEvent){
            //Get to know what to search by user
            var sText = oEvent.getParameter("query");
            //Construct a filter object
            var oFilter1 = new Filter("CATEGORY", FilterOperator.Contains, sText);

            // Create another object for different type to filter
            // var oFilter2 = new Filter("helthBenifits", FilterOperator.Contains, sText);
            //Put all filter inside an array
            // var filterArray = [oFilter1, oFilter2];
            //Construct one more filter object
            // var oFilter = new Filter({
            //     filters: oFilter1,
            //     and: false
            // })
            //Get the list object
            var oList = this.getView().byId("idList");
            //Inject filter inside the binding of item
            oList.getBinding("items").filter(oFilter1);                 
        },

        onDeleteItem: function(oEvent){
            var itemToBeDeleted = oEvent.getParameter("listItem");
            // var oList = this.getView().byId("idList");
            var oList = oEvent.getSource();
            oList.removeItem(itemToBeDeleted);

        },
        onAdd: function(){
            this.oRouter.navTo("create");
        }
    });
    
});