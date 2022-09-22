sap.ui.define([
    'sap/ui/core/mvc/Controller'
], function(Controller) {
    'use strict';
    return Controller.extend("ibm.sd.ap.Controllers.BaseController",{
        x: "Ahamad",
        pi: 3.14,

        someCommonLogic: function(){
            alert("Walllahh");
        }
    })
    
});