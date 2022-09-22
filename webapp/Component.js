sap.ui.define([
    'sap/ui/core/UIComponent'
], function(UIComponent) {
    'use strict';
    return UIComponent.extend("ibm.sd.ap.Component",{
        //Used to link our manifest.json file because all the app configuration 
        //contained inside the manifes
        metadata: {
            manifest: "json"
        },
        //All initialization done in the init function which is a constructor of the class
        init: function(){
            // Call the parent class constructor
            UIComponent.prototype.init.apply(this);
            //Get router from parent class
            var oRouter = this.getRouter();
            //Scan manifest.json for routing configuration
            oRouter.initialize();
        },

        //We will initialize views and return it
        // createContent: function(){
            // var oAppView = new sap.ui.view({
            //     viewName: "ibm.sd.ap.Views.App",
            //     id: "idAppView",
            //     type: "XML"
            // });

            //Create the both view object
            // var oView1 = new sap.ui.view({
            //     viewName: "ibm.sd.ap.Views.View1",
            //     id: "idView1",
            //     type: "XML"
            // });

            // var oView2 = new sap.ui.view({
            //     viewName: "ibm.sd.ap.Views.View2",
            //     id: "idView2",
            //     type: "XML"
            // });

            //Get the container conterol object which is in the root view
            // var oContainerControl = oAppView.byId("idAppCon");

            // //Add the views inside the controller control - page, addPage
            // oContainerControl.addMasterPage(oView1).addDetailPage(oView2);

            // return oAppView;
        // },
        //Destructo- any clean up code
        destroy: {

        }
    })
    
});