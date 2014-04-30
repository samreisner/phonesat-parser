jQuery( document ).ready(function() {
	jQuery("#parsepacketbutton").click(function() {
		jQuery("#warnings").hide();
		jQuery("#theresultsrow").show();
			jQuery("#warningmessages").html("");
		
		ga('send', 'event', 'button', 'click', 'track');

		var rawPacket = jQuery("#rawpacket").val();
		
		//Satellite ID, the packet type, the battery voltage and two reboot counters
		var SatID;
		var PacketType;
		var BatteryVoltage;
		var RebootA;
		var RebootB;
		var Deployed;
		var encodedPacket;
		var Preamble;
		var mtime;
		var ptime;
		var utime;
		var Satellite = "KickSat";
		
		if (jQuery('input[name=satelliteName]:checked').val() == "KickSat") {

			var pattC = /.*?(P4)(C),(\d+?),(\d+?),(\d+?),(\d+?),(.)(.*)/g;
			var pattB = /.*?(P4)(A|D)(.....)(.....)(.*)/g;
			var pattP = /.*?(P4)(P)(.....)(.....)(.*)/g;
		} else {
			var pattC = /.*?(P4)(C),(\d+?),(\d+?),(\d+?),(.)(.*)/g;
			var pattB = /.*?(P4)(A|D)(.....)(.....)(.*)/g;
			var pattP = /.*?(P4)(P)(.....)(.....)(.*)/g;
			Satellite = "PhoneSat";
		}
		
		
		
		var lines = rawPacket.split("\n");
		pattL = /.*\d+.*?\>(.*)$/
		var theHex = "";
		var theHexB = "";
		for (i=0; i<lines.length; i++) {

			if (result = pattL.exec(lines[i])) {
				theHex += RegExp.$1;
			}

		}
		theHex = theHex.replace(/\s/g, '');
		theHexB = rawPacket.replace(/\s/g,'');



		// Match 'P4*,' in a string
		var pattH = /.*?5034..2c.*?/gi;
		

		
		if (result=pattC.exec(rawPacket)) {
	

			Preamble = RegExp.$1;
			PacketType = RegExp.$2;
			BatteryVoltage = RegExp.$3;
			RebootA = RegExp.$4;
			RebootB = RegExp.$5;
			Deployed = RegExp.$6;
			SatID = (toDec(RegExp.$7))-32;
			encodedPacket = RegExp.$8;
			var six = RegExp.$6;
			var seven = RegExp.$7;
			var eight;
			if (typeof RegExp.$8 != 'undefined')
				eight = RegExp.$8;
			if (Satellite=="KickSat") {
				Deployed = six;
				SatID = (toDec(seven))-32;
				encodedPacket = eight;
			} else {
				SatID = (toDec(six))-32;
				encodedPacket = seven;			
			}
			jQuery("#results").html("");
			var d1 = new Date();
			jQuery("#results").append("\nWeb Parser v.3 - http://samreisner.com/phonesat-parser/\nMode Selected: "+Satellite+"\nReport Generated at "+d1.toUTCString()+"\n\n");
			
			
			jQuery("#results").append("Preamble: "+Preamble+"<br />");
			jQuery("#results").append("Packet Type: "+PacketType+" (Charging)<br />");
			jQuery("#results").append("Scaled Battery Voltage (V): "+BatteryVoltage+" <span style='color:555;'><i>Measured: </i>"+(BatteryVoltage/102.3).toFixed(5)+"</span><br />");						
			jQuery("#results").append("Phone reboots: "+RebootA+"<br />");						
			jQuery("#results").append("ACS reboots: "+RebootB+"<br />");						
			if (Satellite=="KickSat")
				jQuery("#results").append("Deployed Indicator: "+Deployed+"<br />");						
			jQuery("#results").append("Satellite ID: "+SatID+"<br />");		
			theOffset = 17;
			ga('send', 'event', 'track', 'track', 'track',1);				
		} else if (result=pattB.exec(rawPacket)) {
			Preamble = RegExp.$1;
			PacketType = RegExp.$2;
			mtime = RegExp.$3;
			ptime = RegExp.$4;
			encodedPacket = RegExp.$5;
			jQuery("#results").html("");
			var d1 = new Date();
			jQuery("#results").append("\nWeb Parser v.3 - http://samreisner.com/phonesat-parser/\nMode Selected: "+Satellite+"\nReport Generated at "+d1.toUTCString()+"\n\n");
			
			jQuery("#results").append("Preamble: "+Preamble+"<br />");
			jQuery("#results").append("Packet Type: "+PacketType+" (bdot <b>CAUTION: NOT IMPLEMENTED</b>)<br />");
			
			jQuery("#warnings").show();
			jQuery("#warningmessages").append("BDOT packets not implemented; please check with author for more information/updates<br />");

			
			jQuery("#results").append("Mission Time: "+mtime+"<br />");
			jQuery("#results").append("Phone Time: "+ptime+"<br />");
			theOffset = 13;
			ga('send', 'event', 'track', 'track', 'track',2);		
			
		} else if (result=pattP.exec(rawPacket)) {
			Preamble = RegExp.$1;
			PacketType = RegExp.$2;
			mtime = RegExp.$3;
			utime = RegExp.$4;
			encodedPacket = RegExp.$5;
			jQuery("#results").html("");
			var d1 = new Date();
			jQuery("#results").append("\nWeb Parser v.3 - http://samreisner.com/phonesat-parser/\nMode Selected: "+Satellite+"\nReport Generated at "+d1.toUTCString()+"\n\n");
			
			jQuery("#results").append("Preamble: "+Preamble+"<br />");
			jQuery("#results").append("Packet Type: "+PacketType+" (pointing <b>CAUTION: NOT IMPLEMENTED</b>)<br />");
			jQuery("#warnings").show();
			jQuery("#warningmessages").append("POINTING packets not implemented; please check with author for more information/updates<br />");
			
			
			jQuery("#results").append("Mission Time: "+mtime+"<br />");
			jQuery("#results").append("UTC Time (uploaded): "+utime+"<br />");
			theOffset = 13;			
			ga('send', 'event', 'track', 'track', 'track',3);		
			
		} else if (result=pattH.exec(theHex)) {
//			var os=require('os')
			//alert ("found hex");


			//alert(theHex);
			str = "";
			for (i=0; i<theHex.length; i+=2) {
				str += String.fromCharCode(parseInt(theHex.substr(i, 2), 16));
			}
			jQuery("#rawpacket").val(str);
			ga('send', 'event', 'track', 'track', 'track',4);		

			jQuery("#parsepacketbutton").click();
			
			
		} else if (result=pattH.exec(theHexB)) {
//			var os=require('os')
			//alert ("found hex");


			//alert(theHex);
			str = "";
			for (i=0; i<theHexB.length; i+=2) {
				str += String.fromCharCode(parseInt(theHexB.substr(i, 2), 16));
			}
			jQuery("#rawpacket").val(str);
			ga('send', 'event', 'track', 'track', 'track',4);		

			jQuery("#parsepacketbutton").click();
			
			
		} else {
			jQuery("#warnings").show();
			jQuery("#warningmessages").append("Did not find preamble of 'P4[C|P|A|D] with enough additional information to decode the contents.<br />");
			ga('send', 'event', 'track', 'track', 'track',5);		

		}					
			

			/*
			var res = [ ];
			var binaryPacket = "";
			var pad = "00000000";
			encodedPacket.split('').forEach(function( letter ) {
			    var bin = letter.charCodeAt( 0 ).toString( 2 );
			    bin = pad.substring(0, pad.length - bin.length) + bin;
				jQuery("#results").append(bin);
				binaryPacket += ""+bin;	  
			});

			jQuery("#results").append( res+"<br />" );
			*/
			vars = initializeVariables(PacketType);
			//console.log(vars);		
			for (var i = 0; i < vars.length; i++) {
				var theValue = getPiece(vars[i],encodedPacket,theOffset);
				jQuery("#results").append("<span data-toggle='tooltip' data-placement='right' title='"+vars[i].description+"'>"+vars[i].name + ":</span> "+theValue+" <span style='color: #CCC;'>"+vars[i].unit+"</span> "+additionalScaling(vars[i],theValue)+"<br />");
			}
			
			jQuery("[data-toggle=tooltip]").tooltip();

		
	});
	




});

function toDec(c) {

	if (c.charCodeAt(0) <= 255)
		return c.charCodeAt(0);
	theMap = Array();
	theMap[8364]=128;
	theMap[8218]=130;
	theMap[402]=131;
	theMap[8222]=132;
	theMap[8230]=133;
	theMap[8224]=134;
	theMap[8225]=135;
	theMap[710]=136;
	theMap[8240]=137;
	theMap[352]=138;
	theMap[8249]=139;
	theMap[338]=140;
	theMap[381]=142;
	theMap[8216]=145;
	theMap[8217]=146;
	theMap[8220]=147;
	theMap[8221]=148;
	theMap[8226]=149;
	theMap[8211]=150;
	theMap[8212]=151;
	theMap[732]=152;
	theMap[8482]=153;
	theMap[353]=154;
	theMap[8250]=155;
	theMap[339]=156;
	theMap[382]=158;
	theMap[376]=159;
	
	if (typeof theMap[c.charCodeAt()] === 'undefined') {
		// variable is undefined
		//console.log("Did not find in map: "+c.charCodeAt());
		return c.charCodeAt();
	} else
		return theMap[c.charCodeAt()];
	
}


function getPiece(theVar,theString,offset) {
	var thisVarString = theString.substr(((theVar.offset-offset)),(theVar.size));
	var numBytes = theVar.size;	
	var places = 1;
	var unscaled = 0;
	var max = 1;
	for (i = (numBytes-1); i>=0; i--) {
		max*=224;
		var thisChar = thisVarString.substr(i,1);
		//console.log("Thischar: "+thisChar);

		if ((toDec(thisChar) > 255) || (toDec(thisChar) < 32)) {
			jQuery("#warnings").show();
			jQuery("#warningmessages").append("Character '"+thisChar+"' out of range: Decimal Value should be between 0-255, but we got: "+toDec(thisChar)+".  Bad data ahead<br />");
		}
		//console.log (thisChar +" is: "+toDec(thisChar));
		unscaled += (toDec(thisChar) - 32) * places;
		places*=224;
		//console.log ("Unscaled is: "+unscaled);
		
	}
	var scaled = unscaled/(max -1);
	//console.log("Scaled: "+scaled);
	var range =(theVar.scalemax-theVar.scalemin);
	//console.log("Range: "+range);
	//console.log("R*S: "+(range*scaled));
	
	var number = (range*scaled)-(0-theVar.scalemin);	
//	return ((theVar.scalemax-theVar.scalemin)*scaled)-theVar.scalemax;
//	return number+" "+(range*scaled)-(0-theVar.scalemin)+" Unshifted: "+(range*scaled)+" - percentage: "+unscaled/max+" -unscaled is: "+unscaled+" ("+theString.substr(((theVar.offset-offset)*8),(theVar.size)*8)+")";

	return number.toFixed(5);
}

function additionalScaling(theVar,theValue) {
	if (theVar.additionalScaling != undefined) {
		return " <span style='color: #555;'><i>Measured: </i>"+theVar.additionalScaling(theValue).toFixed(5) +" "+theVar.unit+"</span>";
	} else return "";
}


function initializeVariables(PacketType) {
	variables = [];

	if (PacketType == "C") {
	variables[0] = {offset:17, size:2, name:"mag_bef_x", description:"Magnetic Field X - before test",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[1] = {offset:19, size:2, name:"gyro_bef_x", description:"Rotation speed X - before test",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[2] = {offset:21, size:2, name:"magP_actHI_x", description:"Magnetic Field-X: coil active +X Hi(255)",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[3] = {offset:23, size:2, name:"magP_actMed_x", description:"Magnetic Field-X: coil active +X Med(127)",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[4] = {offset:25, size:2, name:"magN_actHI_x", description:"Magnetic Field-X: coil active -X Hi(255)",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[5] = {offset:27, size:2, name:"magN_actMed_x", description:"Magnetic Field-X: coil active -X Med(127)",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[6] = {offset:29, size:2, name:"gyroP_actHI_x", description:"Rotation Speed-X: RW active +X Hi(255)",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[7] = {offset:31, size:2, name:"gyroP_actMed_x", description:"Rotation Speed-X: RW active +X Med(127)",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[8] = {offset:33, size:2, name:"gyroN_actHI_x", description:"Rotation Speed-X: RW active -X Hi(255)",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[9] = {offset:35, size:2, name:"gyroN_actMed_x", description:"Rotation Speed-X: RW active -X Med(127)",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[10] = {offset:37, size:2, name:"mag_aft_x", description:"Magnetic Field-X after test",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[11] = {offset:39, size:2, name:"gyro_aft_x", description:"Rotation speed x: after test",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[12] = {offset:41, size:2, name:"mag_bef_y", description:"Magnetic Field Y Before Test",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[13] = {offset:43, size:2, name:"gyro_bef_y", description:"Rotation Speed Y Before Test",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[14] = {offset:45, size:2, name:"magP_actHI_y", description:"Magnetic Field Y: Coil active +X Hi (255)",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[15] = {offset:47, size:2, name:"magP_actMed_y", description:"Magnetic Field Y: Coil active +X Med (127)",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[16] = {offset:49, size:2, name:"magN_actHI_y", description:"Magnetic Field Y: Coil ative -X Hi (255)",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[17] = {offset:51, size:2, name:"magN_actMed_y", description:"Magnetic Field Y: Coil ative -X Med(127)",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[18] = {offset:53, size:2, name:"gyroP_actHI_y", description:"Rotation Speed Y: RW active +X Hi (255)",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[19] = {offset:55, size:2, name:"gyroP_actMed_y", description:"Rotation Speed Y: RW active +X Med (127)",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[20] = {offset:57, size:2, name:"gyroN_actHI_y", description:"Rotation Speed Y: RW active -X Hi (255)",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[21] = {offset:59, size:2, name:"gyroN_actMed_y", description:"Rotation Speed Y: RW active -X Med (127)",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[22] = {offset:61, size:2, name:"mag_aft_y", description:"Magnetic field Y - after test",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[23] = {offset:63, size:2, name:"gyro_aft_y", description:"Rotation Speed Y - after Test",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[24] = {offset:65, size:2, name:"mag_bef_z", description:"Magnetic field Z - before test",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[25] = {offset:67, size:2, name:"gyro_bef_z", description:"Rotation Speed Z - before test",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[26] = {offset:69, size:2, name:"magP_actHI_z", description:"Magnetic Field Z coil active +X Hi(255)",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[27] = {offset:71, size:2, name:"magP_actMed_z", description:"Magnetic Field Z coil active -X Med(127)",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[28] = {offset:73, size:2, name:"magN_actHI_z", description:"Magnetic Field Z coil active -X Hi (255)",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[29] = {offset:75, size:2, name:"magN_actMed_z", description:"Magnetic Field Z coil active -X Med(127)",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[30] = {offset:77, size:2, name:"gyroP_actHI_z", description:"Rotation Speed Z: RW active +X Hi(255)",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[31] = {offset:79, size:2, name:"gyroP_actMed_z", description:"Rotation Speed Z: RW active +X Med(127)",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[32] = {offset:81, size:2, name:"gyroN_actHI_z", description:"Rotation Speed Z: RW active -X Hi(255)",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[33] = {offset:83, size:2, name:"gyroN_actMed_z", description:"Rotation Speed Z: RW active -X Med(255)",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[34] = {offset:85, size:2, name:"mag_aft_z", description:"Magnetic Field Z after test",unit: "uT",scalemin:"-999",scalemax:"999",};
	variables[35] = {offset:87, size:2, name:"gyro_aft_z", description:"Rotation Speed Z after test",unit: "10*rad/s",scalemin:"-20",scalemax:"20",};
	variables[36] = {offset:89, size:2, name:"i_MHX", description:"current of MHX",unit: "mAmp",scalemin:"0",scalemax:"1023",additionalScaling:function(v) { return v*0.0021;},};
	variables[37] = {offset:91, size:2, name:"i_ADCS", description:"current of ADCS",unit: "mAmp",scalemin:"0",scalemax:"1023",additionalScaling:function(v) { return v*0.00019167;},};
	variables[38] = {offset:93, size:2, name:"i_solarXp", description:"current of Solar Panel X+",unit: "mAmp",scalemin:"0",scalemax:"1023",};
	variables[39] = {offset:95, size:2, name:"i_solarXn", description:"current of solar panel X-",unit: "mAmp",scalemin:"0",scalemax:"1023",};
	variables[40] = {offset:97, size:2, name:"i_solarYp", description:"current of solar panel Y+",unit: "mAmp",scalemin:"0",scalemax:"1023",};
	variables[41] = {offset:99, size:2, name:"i_solarYn", description:"current of solar panel Y-",unit: "mAmp",scalemin:"0",scalemax:"1023",};
	variables[42] = {offset:101, size:2, name:"i_solarZp", description:"current of solar panel Z+",unit: "mAmp",scalemin:"0",scalemax:"1023",};
	variables[43] = {offset:103, size:2, name:"i_solarZn", description:"current of solar panel Z-",unit: "mAmp",scalemin:"0",scalemax:"1023",};
	variables[44] = {offset:105, size:2, name:"t_phone", description:"temperature of phone board",unit: "C",scalemin:"0",scalemax:"1023",additionalScaling:function(v) { return (v*.4888)-273 },};
	variables[45] = {offset:107, size:2, name:"t_ADCS_MHX", description:"temperature of ADCS_MHX board",unit: "C",scalemin:"0",scalemax:"1023",additionalScaling:function(v) { return (v*.4888)-273 },};
	variables[46] = {offset:109, size:2, name:"t_solarXp", description:"temperature of solar panel X+",unit: "C",scalemin:"0",scalemax:"1023",additionalScaling:function(v) { return (v*.4888)-273 },};
	variables[47] = {offset:111, size:2, name:"t_solarXn", description:"temperature of solar panel X-",unit: "C",scalemin:"0",scalemax:"1023",additionalScaling:function(v) { return (v*.4888)-273 },};
	variables[48] = {offset:113, size:2, name:"t_solarYp", description:"temperature of solar panel Y+",unit: "C",scalemin:"0",scalemax:"1023",additionalScaling:function(v) { return (v*.4888)-273 },};
	variables[49] = {offset:115, size:2, name:"t_solarYn", description:"temperature of solar panel Y-",unit: "C",scalemin:"0",scalemax:"1023",additionalScaling:function(v) { return (v*.4888)-273 },};
	variables[50] = {offset:117, size:2, name:"t_solarZp", description:"temperature of solar panel Z+",unit: "C",scalemin:"0",scalemax:"1023",additionalScaling:function(v) { return (v*.4888)-273 },};
	variables[51] = {offset:119, size:2, name:"t_solarZn", description:"temperature of solar panel Z-",unit: "C",scalemin:"0",scalemax:"1023",additionalScaling:function(v) { return (v*.4888)-273 },};	
	} // Charge packet
	
	if ((PacketType=="A") || (PacketType=="D")) {
		variables.push({offset:13, size:4, name:"bdot_time", description:"",unit: "~",scalemin:"",scalemax:"",scaleType:"unscaledint"});
		variables.push({offset:17, size:2, name:"M1_bdot_mag_x", description:"(1) Magnetic field intensity-x",unit: "uT",scalemin:"-999",scalemax:"999"});
		variables.push({offset:19, size:2, name:"M1_bdot_mag_y", description:"(1) Magnetic field intensity-y",unit: "uT",scalemin:"-999",scalemax:"999"});
		variables.push({offset:21, size:2, name:"M1_bdot_mag_z", description:"(1) Magnetic field intensity-z",unit: "uT",scalemin:"-999",scalemax:"999"});
		variables.push({offset:23, size:2, name:"M1_bdot_gyro_x", description:"(1) Calibrated raw spin rate-x",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:25, size:2, name:"M1_bdot_gyro_y", description:"(1) Calibrated raw spin rate-y",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:27, size:2, name:"M1_bdot_gyro_z", description:"(1) Calibrated raw spin rate-z",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:29, size:2, name:"M1_bdot_coil_x", description:"(1) magnetorquer coil value-x",unit: "mA/m^2",scalemin:"-1",scalemax:"1"});
		variables.push({offset:31, size:2, name:"M1_bdot_coil_y", description:"(1) magnetorquer coil value-y",unit: "mA/m^2",scalemin:"-1",scalemax:"1"});
		variables.push({offset:33, size:2, name:"M1_bdot_coil_z", description:"(1) magnetorquer coil value-z",unit: "mA/m^2",scalemin:"-1",scalemax:"1"});		

			
		variables.push({offset:57, size:4, name:"bdot_time", description:"",unit: "~",scalemin:"",scalemax:"",scaleType:"unscaledint"});
		variables.push({offset:61, size:2, name:"M3_bdot_mag_x", description:"(3) Magnetic field intensity-x",unit: "uT",scalemin:"-999",scalemax:"999"});
		variables.push({offset:63, size:2, name:"M3_bdot_mag_y", description:"(3) Magnetic field intensity-y",unit: "uT",scalemin:"-999",scalemax:"999"});
		variables.push({offset:65, size:2, name:"M3_bdot_mag_z", description:"(3) Magnetic field intensity-z",unit: "uT",scalemin:"-999",scalemax:"999"});
		variables.push({offset:67, size:2, name:"M3_bdot_gyro_x", description:"(3) Calibrated raw spin rate-x",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:69, size:2, name:"M3_bdot_gyro_y", description:"(3) Calibrated raw spin rate-y",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:71, size:2, name:"M3_bdot_gyro_z", description:"(3) Calibrated raw spin rate-z",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:73, size:2, name:"M3_bdot_coil_x", description:"(3) magnetorquer coil value-x",unit: "mA/m^2",scalemin:"-1",scalemax:"1"});
		variables.push({offset:75, size:2, name:"M3_bdot_coil_y", description:"(3) magnetorquer coil value-y",unit: "mA/m^2",scalemin:"-1",scalemax:"1"});
		variables.push({offset:77, size:2, name:"M3_bdot_coil_z", description:"(3) magnetorquer coil value-z",unit: "mA/m^2",scalemin:"-1",scalemax:"1"});		

		variables.push({offset:79, size:4, name:"bdot_time", description:"",unit: "~",scalemin:"",scalemax:"",scaleType:"unscaledint"});
		variables.push({offset:83, size:2, name:"M4_bdot_mag_x", description:"(4) Magnetic field intensity-x",unit: "uT",scalemin:"-999",scalemax:"999"});
		variables.push({offset:85, size:2, name:"M4_bdot_mag_y", description:"(4) Magnetic field intensity-y",unit: "uT",scalemin:"-999",scalemax:"999"});
		variables.push({offset:87, size:2, name:"M4_bdot_mag_z", description:"(4) Magnetic field intensity-z",unit: "uT",scalemin:"-999",scalemax:"999"});
		variables.push({offset:89, size:2, name:"M4_bdot_gyro_x", description:"(4) Calibrated raw spin rate-x",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:91, size:2, name:"M4_bdot_gyro_y", description:"(4) Calibrated raw spin rate-y",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:93, size:2, name:"M4_bdot_gyro_z", description:"(4) Calibrated raw spin rate-z",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:95, size:2, name:"M4_bdot_coil_x", description:"(4) magnetorquer coil value-x",unit: "mA/m^2",scalemin:"-1",scalemax:"1"});
		variables.push({offset:97, size:2, name:"M4_bdot_coil_y", description:"(4) magnetorquer coil value-y",unit: "mA/m^2",scalemin:"-1",scalemax:"1"});
		variables.push({offset:99, size:2, name:"M4_bdot_coil_z", description:"(4) magnetorquer coil value-z",unit: "mA/m^2",scalemin:"-1",scalemax:"1"});		


		variables.push({offset:101, size:4, name:"bdot_time", description:"",unit: "~",scalemin:"",scalemax:"",scaleType:"unscaledint"});
		variables.push({offset:105, size:2, name:"M5_bdot_mag_x", description:"(5) Magnetic field intensity-x",unit: "uT",scalemin:"-999",scalemax:"999"});
		variables.push({offset:107, size:2, name:"M5_bdot_mag_y", description:"(5) Magnetic field intensity-y",unit: "uT",scalemin:"-999",scalemax:"999"});
		variables.push({offset:109, size:2, name:"M5_bdot_mag_z", description:"(5) Magnetic field intensity-z",unit: "uT",scalemin:"-999",scalemax:"999"});
		variables.push({offset:111, size:2, name:"M5_bdot_gyro_x", description:"(5) Calibrated raw spin rate-x",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:113, size:2, name:"M5_bdot_gyro_y", description:"(5) Calibrated raw spin rate-y",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:115, size:2, name:"M5_bdot_gyro_z", description:"(5) Calibrated raw spin rate-z",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:117, size:2, name:"M5_bdot_coil_x", description:"(5) magnetorquer coil value-x",unit: "mA/m^2",scalemin:"-1",scalemax:"1"});
		variables.push({offset:119, size:2, name:"M5_bdot_coil_y", description:"(5) magnetorquer coil value-y",unit: "mA/m^2",scalemin:"-1",scalemax:"1"});
		variables.push({offset:121, size:2, name:"M5_bdot_coil_z", description:"(5) magnetorquer coil value-z",unit: "mA/m^2",scalemin:"-1",scalemax:"1"});		


	} 	if (PacketType=="P") {
		variables.push({offset:13, size:2, name:"mag_x", description:"Magnetic field intensity-x",unit: "uT",scalemin:"-999",scalemax:"999"});
		variables.push({offset:15, size:2, name:"mag_y", description:"Magnetic field intensity-y",unit: "uT",scalemin:"-999",scalemax:"999"});
		variables.push({offset:17, size:2, name:"mag_z", description:"Magnetic field intensity-z",unit: "uT",scalemin:"-999",scalemax:"999"});
		variables.push({offset:19, size:2, name:"coil_x", description:"Magnetorquer coil value-x",unit: "mA/m^2",scalemin:"-1",scalemax:"1"});
		variables.push({offset:21, size:2, name:"coil_y", description:"Magnetorquer coil value-y",unit: "mA/m^2",scalemin:"-1",scalemax:"1"});
		variables.push({offset:23, size:2, name:"coil_z", description:"Magnetorquer coil value-z",unit: "mA/m^2",scalemin:"-1",scalemax:"1"});		

		variables.push({offset:25, size:2, name:"magref_x", description:"magnetorquer-ref-x",unit: "mA/m^2",scalemin:"-255",scalemax:"255"});
		variables.push({offset:27, size:2, name:"magref_y", description:"magnetorquer-ref-y",unit: "mA/m^2",scalemin:"-255",scalemax:"255"});
		variables.push({offset:29, size:2, name:"magref_z", description:"magnetorquer-ref-z",unit: "mA/m^2",scalemin:"-255",scalemax:"255"});		

		variables.push({offset:31, size:2, name:"sunref_x", description:"sun-ref-x",unit: "~",scalemin:"0",scalemax:"1000000000000"});
		variables.push({offset:33, size:2, name:"sunref_y", description:"sun-ref-y",unit: "~",scalemin:"0",scalemax:"1000000000000"});
		variables.push({offset:35, size:2, name:"sunref_z", description:"sun-ref-z",unit: "~",scalemin:"0",scalemax:"1000000000000"});
		
		variables.push({offset:37, size:2, name:"gyro_x", description:"Calibrated raw spin rate-x",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:39, size:2, name:"gyro_y", description:"Calibrated raw spin rate-y",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:41, size:2, name:"gyro_z", description:"Calibrated raw spin rate-z",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		
		variables.push({offset:43, size:2, name:"PWM_x", description:"PWM: Reaction wheel scalar-x",unit: "RPM",scalemin:"-1",scalemax:"1"});
		variables.push({offset:45, size:2, name:"PWM_y", description:"PWM: Reaction wheel scalar-y",unit: "RPM",scalemin:"-1",scalemax:"1"});
		variables.push({offset:47, size:2, name:"PWM_z", description:"PWM: Reaction wheel scalar-z",unit: "RPM",scalemin:"-1",scalemax:"1"});		

		variables.push({offset:49, size:2, name:"quat_1", description:"Q estimate(1) - Attitude",unit: "~",scalemin:"-1",scalemax:"1"});
		variables.push({offset:51, size:2, name:"quat_2", description:"Q estimate(2) - Attitude",unit: "~",scalemin:"-1",scalemax:"1"});
		variables.push({offset:53, size:2, name:"quat_3", description:"Q estimate(3) - Attitude",unit: "~",scalemin:"-1",scalemax:"1"});
		variables.push({offset:55, size:2, name:"quat_4", description:"Q estimate(4) - Attitude",unit: "~",scalemin:"-1",scalemax:"1"});

		variables.push({offset:57, size:2, name:"spin_x", description:"Filtered spin rate-x",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:59, size:2, name:"spin_y", description:"Filtered spin rate-y",unit: "rad/s",scalemin:"-20",scalemax:"20"});
		variables.push({offset:61, size:2, name:"spin_z", description:"Filtered spin rate-z",unit: "rad/s",scalemin:"-20",scalemax:"20"});

		variables.push({offset:63, size:3, name:"pos_x", description:"Position X - ref to center of earth",unit: "km",scalemin:"-8000000",scalemax:"8000000"});
		variables.push({offset:66, size:3, name:"pos_y", description:"Position Y - ref to center of earth",unit: "km",scalemin:"-8000000",scalemax:"8000000"});
		variables.push({offset:69, size:3, name:"pos_z", description:"Position Z - ref to center of earth",unit: "km",scalemin:"-8000000",scalemax:"8000000"});
		
		variables.push({offset:72, size:2, name:"vel_x", description:"velocity-x",unit: "m/s",scalemin:"-9000",scalemax:"9000"});
		variables.push({offset:74, size:2, name:"vel_y", description:"velocity-y",unit: "m/s",scalemin:"-9000",scalemax:"9000"});
		variables.push({offset:76, size:2, name:"vel_z", description:"velocity-z",unit: "m/s",scalemin:"-9000",scalemax:"9000"});

		variables.push({offset:78, size:2, name:"bat_volt", description:"scaled battery to voltage",unit: "TBC",scalemin:"0",scalemax:"1000",});
		
		variables.push({offset:80, size:2, name:"i_MHX", description:"current of MHX board",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:82, size:2, name:"i_ADCS", description:"current of ADCS board",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:84, size:2, name:"i_solarXp", description:"",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:86, size:2, name:"i_solarXn", description:"",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:88, size:2, name:"i_solarYp", description:"",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:90, size:2, name:"i_solarYn", description:"",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:92, size:2, name:"i_solarZp", description:"",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:94, size:2, name:"i_solarZn", description:"",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:96, size:2, name:"t_sten", description:"temp of stensat board",unit: "TBC",scalemin:"0",scalemax:"1023",});		
		variables.push({offset:98, size:2, name:"t_EPS", description:"temp of EPS board",unit: "TBC",scalemin:"0",scalemax:"1023",});		
		variables.push({offset:100, size:2, name:"t_phone", description:"temp of phoneboard",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:102, size:2, name:"t_ADCS_MHX", description:" temp of ADCS MHX",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:104, size:2, name:"t_router", description:" temp of router board",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:106, size:2, name:"t_solarXp", description:"temp of solar panel X+",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:108, size:2, name:"t_solarXn", description:"temp of solar panel X-",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:110, size:2, name:"t_solarYp", description:"temp of solar panel Y+",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:112, size:2, name:"t_solarYn", description:"temp of solar panel Y-",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:114, size:2, name:"t_solarZp", description:"temp of solar panel Z+",unit: "TBC",scalemin:"0",scalemax:"1023",});
		variables.push({offset:116, size:2, name:"t_solarZp", description:"temp of solar panel Z-",unit: "TBC",scalemin:"0",scalemax:"1023",});
		
		
		
		
	}
	return variables;
	
}