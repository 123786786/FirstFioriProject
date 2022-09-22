sap.ui.define([
    'ibm/sd/ap/Controllers/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    "sap/ui/core/routing/History"
], function(oController, MessageBox, MessageToast, History) {
    'use strict';
    return oController.extend("ibm.sd.ap.Controllers.View3",{
        onInit:function(){
            // this.someCommonLogic();
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("suppl").attachMatched(this.onSparta, this);
        },

        onSparta: function(oEvent){
            var fruitId = oEvent.getParameter("arguments").supplierId;
            var sPath = '/' + fruitId;
            this.getView().bindElement(sPath);

        },

        onGoToBack: function(){
            var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				this.oRouter.navTo("spiderman", {}, true);
			}
        }
    });
    
});