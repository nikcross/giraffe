     function loadContent(layerId,pageFile) {
         data=ajax.doGet(pageFile,"");
         document.getElementById(layerId).innerHTML=data;
     }
	function getValue(id) {
		return document.getElementById(id).value;
	}
	function setValue(id,value) {
		document.getElementById(id).value=value;
	}
	     
    function initDevice() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }

  var options = null;
  var watchID = null;
    
    function onDeviceReady() {   
        options = { frequency: 500 };
        watchID = navigator.accelerometer.watchAcceleration(processAcceleration, onError, options);
        watchID = navigator.compass.watchHeading(processHeading, onError, options);
        watchID = navigator.geolocation.watchPosition(processPosition, onError, options);      
        watchID = document.addEventListener("menubutton", onMenu, false);
        watchID = document.addEventListener("searchbutton", onSearch, false);       
        initApplication();
    }

    function onError() { alert("An error has occurred.");}
    function processAcceleration(acceleration) {}
    function processHeading(heading) {}
    function processPosition(position) {}
    function onMenu() {}
    function onSearch() {}
    
    function initApplication() {}
    
    function generatePurchaseButton(id,product,priceGross,priceNet)
    {
    	var html = "<p>"+product+": &pound; "+priceGross+" inc. VAT<br/>"+
    	"<a href=\"#\"><img src=\"https://checkout.google.com/buttons/checkout.gif?merchant_id=414555442310905&w=160&h=43&style=trans&variant=text&loc=en_GB\" border=\"0\"/></a>"+
    	"</p>";
    	document.getElementById(id).innerHTML=html;
    }

    var GRAVITY_EARTH = 9.80665;    
    function convertToAngles(acceleration) {
  	  ax = -acceleration.x/GRAVITY_EARTH;
  	  ay = -acceleration.y/GRAVITY_EARTH;
  	  az = acceleration.z/GRAVITY_EARTH;

  	  totalA = Math.pow((ax*ax)+(ay*ay)+(az*az),0.5);

  	  tiltX = -Math.asin(ax/totalA);
  	  tiltY = -Math.asin(ay/totalA);
  	  tiltZ = -Math.asin(az/totalA);
  	  
  	  return [tiltX,tiltY,tiltZ];
    }