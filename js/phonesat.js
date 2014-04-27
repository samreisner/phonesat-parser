jQuery( document ).ready(function() {
	jQuery("#parsepacketbutton").click(function() {
		var rawPacket = jQuery("#rawpacket").val();
		
		//Satellite ID, the packet type, the battery voltage and two reboot counters
		var SatID;
		var PacketType;
		var BatteryVoltage;
		var RebootA;
		var RebootB;
		var Deployed;
		var encodedPacket;
		
		//P4C,783,0,0,0,
		//P4C,800,0,0,0,
		
		var patt = /(..)(.),(\d+?),(\d+?),(\d+?),(\d+?),(.*)/g;
		
		if (result=patt.exec(rawPacket)) {
//			result = patt.exec(rawPacket);
			SatID = RegExp.$1;
			PacketType = RegExp.$2;
			BatteryVoltage = RegExp.$3;
			RebootA = RegExp.$4;
			RebootB = RegExp.$5;
			Deployed = RegExp.$6;
			encodedPacket = RegExp.$7;
			jQuery("#results").html("");
			jQuery("#results").append("Sat ID: "+SatID+"<br />");
			jQuery("#results").append("Packet Type: "+PacketType+"<br />");
			jQuery("#results").append("Battery Voltage: "+BatteryVoltage+"<br />");						
			jQuery("#results").append("Reboot Counter 1: "+RebootA+"<br />");						
			jQuery("#results").append("Reboot Counter 2: "+RebootB+"<br />");						
			jQuery("#results").append("Deployed Indicator: "+Deployed+"<br />");						
			jQuery("#results").append("Remainder of Packet: "+encodedPacket+"<br />");						


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

			vars = initializeVariables()
			console.log(vars);		
			theOffset = 16;
			for (var i = 0; i < vars.length; i++) {
				jQuery("#results").append(vars[i].name + ": "+getPiece(vars[i],binaryPacket,theOffset)+"<br />");
			}
		} else {
			alert("Not Matched");
		}
		

		
	
	});
	





});

function getPiece(theVar,theString,offset) {
	if (theVar.varType == "ASCII")
		return String.fromCharCode(parseInt(theString.substr(theVar.offset-offset,(theVar.size)*8) , 2));
	return theString.substr(theVar.offset-offset,(theVar.size)*8);
}

function initializeVariables() {
	variables = [];
	variables[0] = {offset:16, size:1, name:"Satellite ID", description:"T, U",unit: "~",scalemin:"",scalemin:"",varType: "ASCII"};
	variables[1] = {offset:17, size:2, name:"mag_bef_x", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[2] = {offset:19, size:2, name:"gyro_bef_x", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[3] = {offset:21, size:2, name:"magP_actHI_x", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[4] = {offset:23, size:2, name:"magP_actMed_x", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[5] = {offset:25, size:2, name:"magN_actHI_x", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[6] = {offset:27, size:2, name:"magN_actMed_x", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[7] = {offset:29, size:2, name:"gyroP_actHI_x", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[8] = {offset:31, size:2, name:"gyroP_actMed_x", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[9] = {offset:33, size:2, name:"gyroN_actHI_x", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[10] = {offset:35, size:2, name:"gyroN_actMed_x", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[11] = {offset:37, size:2, name:"mag_aft_x", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[12] = {offset:39, size:2, name:"gyro_aft_x", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[13] = {offset:41, size:2, name:"mag_bef_y", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[14] = {offset:43, size:2, name:"gyro_bef_y", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[15] = {offset:45, size:2, name:"magP_actHI_y", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[16] = {offset:47, size:2, name:"magP_actMed_y", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[17] = {offset:49, size:2, name:"magN_actHI_y", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[18] = {offset:51, size:2, name:"magN_actMed_y", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[19] = {offset:53, size:2, name:"gyroP_actHI_y", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[20] = {offset:55, size:2, name:"gyroP_actMed_y", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[21] = {offset:57, size:2, name:"gyroN_actHI_y", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[22] = {offset:59, size:2, name:"gyroN_actMed_y", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[23] = {offset:61, size:2, name:"mag_aft_y", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[24] = {offset:63, size:2, name:"gyro_aft_y", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[25] = {offset:65, size:2, name:"mag_bef_z", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[26] = {offset:67, size:2, name:"gyro_bef_z", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[27] = {offset:69, size:2, name:"magP_actHI_z", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[28] = {offset:71, size:2, name:"magP_actMed_z", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[29] = {offset:73, size:2, name:"magN_actHI_z", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[30] = {offset:75, size:2, name:"magN_actMed_z", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[31] = {offset:77, size:2, name:"gyroP_actHI_z", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[32] = {offset:79, size:2, name:"gyroP_actMed_z", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[33] = {offset:81, size:2, name:"gyroN_actHI_z", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[34] = {offset:83, size:2, name:"gyroN_actMed_z", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[35] = {offset:85, size:2, name:"mag_aft_z", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[36] = {offset:87, size:2, name:"gyro_aft_z", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[37] = {offset:89, size:2, name:"i_MHX", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[38] = {offset:91, size:2, name:"i_ADCS", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[39] = {offset:93, size:2, name:"i_solarXp", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[40] = {offset:95, size:2, name:"i_solarXn", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[41] = {offset:97, size:2, name:"i_solarYp", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[42] = {offset:99, size:2, name:"i_solarYn", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[43] = {offset:101, size:2, name:"i_solarZp", description:"",unit: "~",scalemin:"",scalemin:"",};
	variables[44] = {offset:103, size:2, name:"i_solarZn", description:"",unit: "~",scalemin:"",scalemin:"",};

	return variables;
	
}