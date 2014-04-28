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
	var thisVarString = theString.substr(((theVar.offset-offset)*8),(theVar.size)*8);
	if (theVar.varType == "ASCII")
		return String.fromCharCode(parseInt(theString.substr(theVar.offset-offset,(theVar.size)*8) , 2));
		
	var numBytes = theVar.size;
	
	var places = 1;
	var unscaled = 0;
	var max = 1;
	for (i = (numBytes-1); i>=0; i--) {
		max*=224;
		console.log("Substring "+i+": "+thisVarString.substr((8*i),8));
		unscaled += (parseInt(thisVarString.substr((8*i),8),2) - 32) * places;
		places*=224;
		
		
	}
	var scaled = unscaled/max;
	
//	return ((theVar.scalemax-theVar.scalemin)*scaled)-theVar.scalemax;
	return ((theVar.scalemax-theVar.scalemin)*scaled)+" - percentage: "+unscaled/max+" -unscaled is: "+unscaled+" ("+theString.substr(((theVar.offset-offset)*8),(theVar.size)*8)+")";
}


/*



Full Binary String
01010101
(00110000)(11110001)
 00110000  11110001

(00100000)(01001110)
 00100000  01001110
 
 
(01100000)(01011011)
 01100000  01011011


mag_bef_x: 0.07559390943877552 -unscaled is: 3793 (0011000011110001)  48 241  / 16  209  3793
gyro_bef_x: 0.0009167729591836735 -unscaled is: 46 (0010000001001110) 32 78 / 0 46   46   
magP_actHI_x: 0.28689014668367346 -unscaled is: 14395 (0110000001011011)
magP_actMed_x: 0.2860730229591837 -unscaled is: 14354 (0110000000110010)




011000000011001001100000101100000110000001100001001000000100000000100000010100010010000001011111001000000110011100110000101001010010000000110001001000000010101100100000111100010010000011111110010100101101010100100110111101111100011000101100111010110110110110110111010011000010000011101101001000001110101100100000110000110010000011110000100000000110011101000000100000011110000010000001011110101011000010001001111101111000000111111011110001001000001010011000100000101110000010000011100110001000001100011101111101010010000010000011011010001000000010000000100000001000000010100001101000011001001100100100110100010000000010001001111100111111011101010101000100110100000010000000100000001000000010000000100000001000001101110010110001


Substring 1: 11110001 phonesat.js:84
Substring 0: 00110000 phonesat.js:84
Substring 1: 01001110 phonesat.js:84
Substring 0: 00100000 phonesat.js:84
Substring 1: 01011011 phonesat.js:84
Substring 0: 01100000 phonesat.js:84
Substring 1: 00110010 phonesat.js:84
Substring 0: 01100000 phonesat.js:84
Substring 1: 10110000 phonesat.js:84
Substring 0: 01100000 phonesat.js:84
Substring 1: 01100001 phonesat.js:84
Substring 0: 01100000 phonesat.js:84
Substring 1: 01000000 phonesat.js:84
Substring 0: 00100000 

*/
function initializeVariables() {
	variables = [];
	variables[0] = {offset:16, size:1, name:"Satellite ID", description:"T, U",unit: "~",scalemin:"",scalemax:"",varType: "ASCII"};
	variables[1] = {offset:17, size:2, name:"mag_bef_x", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[2] = {offset:19, size:2, name:"gyro_bef_x", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[3] = {offset:21, size:2, name:"magP_actHI_x", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[4] = {offset:23, size:2, name:"magP_actMed_x", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[5] = {offset:25, size:2, name:"magN_actHI_x", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[6] = {offset:27, size:2, name:"magN_actMed_x", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[7] = {offset:29, size:2, name:"gyroP_actHI_x", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[8] = {offset:31, size:2, name:"gyroP_actMed_x", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[9] = {offset:33, size:2, name:"gyroN_actHI_x", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[10] = {offset:35, size:2, name:"gyroN_actMed_x", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[11] = {offset:37, size:2, name:"mag_aft_x", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[12] = {offset:39, size:2, name:"gyro_aft_x", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[13] = {offset:41, size:2, name:"mag_bef_y", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[14] = {offset:43, size:2, name:"gyro_bef_y", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[15] = {offset:45, size:2, name:"magP_actHI_y", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[16] = {offset:47, size:2, name:"magP_actMed_y", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[17] = {offset:49, size:2, name:"magN_actHI_y", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[18] = {offset:51, size:2, name:"magN_actMed_y", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[19] = {offset:53, size:2, name:"gyroP_actHI_y", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[20] = {offset:55, size:2, name:"gyroP_actMed_y", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[21] = {offset:57, size:2, name:"gyroN_actHI_y", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[22] = {offset:59, size:2, name:"gyroN_actMed_y", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[23] = {offset:61, size:2, name:"mag_aft_y", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[24] = {offset:63, size:2, name:"gyro_aft_y", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[25] = {offset:65, size:2, name:"mag_bef_z", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[26] = {offset:67, size:2, name:"gyro_bef_z", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[27] = {offset:69, size:2, name:"magP_actHI_z", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[28] = {offset:71, size:2, name:"magP_actMed_z", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[29] = {offset:73, size:2, name:"magN_actHI_z", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[30] = {offset:75, size:2, name:"magN_actMed_z", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[31] = {offset:77, size:2, name:"gyroP_actHI_z", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[32] = {offset:79, size:2, name:"gyroP_actMed_z", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[33] = {offset:81, size:2, name:"gyroN_actHI_z", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[34] = {offset:83, size:2, name:"gyroN_actMed_z", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[35] = {offset:85, size:2, name:"mag_aft_z", description:"",unit: "~",scalemin:"-999",scalemax:"999",};
	variables[36] = {offset:87, size:2, name:"gyro_aft_z", description:"",unit: "~",scalemin:"-20",scalemax:"20",};
	variables[37] = {offset:89, size:2, name:"i_MHX", description:"",unit: "~",scalemin:"0",scalemax:"1023",};
	variables[38] = {offset:91, size:2, name:"i_ADCS", description:"",unit: "~",scalemin:"0",scalemax:"1023",};
	variables[39] = {offset:93, size:2, name:"i_solarXp", description:"",unit: "~",scalemin:"0",scalemax:"1023",};
	variables[40] = {offset:95, size:2, name:"i_solarXn", description:"",unit: "~",scalemin:"0",scalemax:"1023",};
	variables[41] = {offset:97, size:2, name:"i_solarYp", description:"",unit: "~",scalemin:"0",scalemax:"1023",};
	variables[42] = {offset:99, size:2, name:"i_solarYn", description:"",unit: "~",scalemin:"0",scalemax:"1023",};
	variables[43] = {offset:101, size:2, name:"i_solarZp", description:"",unit: "~",scalemin:"0",scalemax:"1023",};
	variables[44] = {offset:103, size:2, name:"i_solarZn", description:"",unit: "~",scalemin:"0",scalemax:"1023",};

	return variables;
	
}