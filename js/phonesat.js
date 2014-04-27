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

			encodedPacket.split('').forEach(function( letter ) {
			    var bin = letter.charCodeAt( 0 ).toString( 2 );
			jQuery("#results").append(bin);			    
//        		padding = 8 - bin.length;
//    			res.push( new Array( padding+1 ).join( '0' ) + bin );
			});

			jQuery("#results").append( res );



		} else {
			alert("Not Matched");
		}
		

		
	
	});
	


});
