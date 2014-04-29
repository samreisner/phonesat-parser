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
		var pattH = /.*?50.*?/g;
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
			jQuery("#results").append("Preamble: "+Preamble+"<br />");
			jQuery("#results").append("Packet Type: "+PacketType+" (Charging)<br />");
			jQuery("#results").append("Scaled Battery Voltage (V): "+BatteryVoltage+"<br />");						
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
			jQuery("#results").append("Preamble: "+Preamble+"<br />");
			jQuery("#results").append("Packet Type: "+PacketType+" (pointing <b>CAUTION: NOT IMPLEMENTED</b>)<br />");
			jQuery("#warnings").show();
			jQuery("#warningmessages").append("POINTING packets not implemented; please check with author for more information/updates<br />");
			
			
			jQuery("#results").append("Mission Time: "+mtime+"<br />");
			jQuery("#results").append("UTC Time (uploaded): "+utime+"<br />");
			theOffset = 13;			
			ga('send', 'event', 'track', 'track', 'track',3);		
			
		} else if (result=pattH.exec(rawPacket)) {
//			var os=require('os')
			//alert ("found hex");
			lines = rawPacket.split("\n");
			pattL = /.*\d+.*?\>(.*)$/
			var theHex = "";
			for (i=0; i<lines.length; i++) {

				if (result = pattL.exec(lines[i])) {
					theHex += RegExp.$1;
				}

			}
			theHex = theHex.replace(/\s/g, '');
			//alert(theHex);
			str = "";
			for (i=0; i<theHex.length; i+=2) {
				str += String.fromCharCode(parseInt(theHex.substr(i, 2), 16));
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
				jQuery("#results").append("<span data-toggle='tooltip' data-placement='left' title='"+vars[i].description+"'>"+vars[i].name + ":</span> "+getPiece(vars[i],encodedPacket,theOffset)+" <span style='color: #CCC;'>"+vars[i].unit+"</span><br />");
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

	
	
	
/*
128	200	80	10000000	€	&#128;	&euro;	Euro sign
129	201	81	10000001	 	 	 	 
130	202	82	10000010	‚	&#130;	&sbquo;	Single low-9 quotation mark
131	203	83	10000011	ƒ	&#131;	&fnof;	Latin small letter f with hook
132	204	84	10000100	„	&#132;	&bdquo;	Double low-9 quotation mark
133	205	85	10000101	…	&#133;	&hellip;	Horizontal ellipsis
134	206	86	10000110	†	&#134;	&dagger;	Dagger
135	207	87	10000111	‡	&#135;	&Dagger;	Double dagger
136	210	88	10001000	ˆ	&#136;	&circ;	Modifier letter circumflex accent
137	211	89	10001001	‰	&#137;	&permil;	Per mille sign
138	212	8A	10001010	Š	&#138;	&Scaron;	Latin capital letter S with caron
139	213	8B	10001011	‹	&#139;	&lsaquo;	Single left-pointing angle quotation
140	214	8C	10001100	Œ	&#140;	&OElig;	Latin capital ligature OE
141	215	8D	10001101	 	 	 	 
142	216	8E	10001110	Ž	&#142;	 	Latin captial letter Z with caron
143	217	8F	10001111	 	 	 	 
144	220	90	10010000	 	 	 	 
145	221	91	10010001	‘	&#145;	&lsquo;	Left single quotation mark
146	222	92	10010010	’	&#146;	&rsquo;	Right single quotation mark
147	223	93	10010011	“	&#147;	&ldquo;	Left double quotation mark
148	224	94	10010100	”	&#148;	&rdquo;	Right double quotation mark
149	225	95	10010101	•	&#149;	&bull;	Bullet
150	226	96	10010110	–	&#150;	&ndash;	En dash
151	227	97	10010111	—	&#151;	&mdash;	Em dash
152	230	98	10011000	˜	&#152;	&tilde;	Small tilde
153	231	99	10011001	™	&#153;	&trade;	Trade mark sign
154	232	9A	10011010	š	&#154;	&scaron;	Latin small letter S with caron
155	233	9B	10011011	›	&#155;	&rsaquo;	Single right-pointing angle quotation mark
156	234	9C	10011100	œ	&#156;	&oelig;	Latin small ligature oe
157	235	9D	10011101	 	 	 	 
158	236	9E	10011110	ž	&#158;	 	Latin small letter z with caron
159	237	9F	10011111	Ÿ	&#159;	&yuml;	Latin capital letter Y with diaeresis
160	240	A0	10100000	 	&#160;	&nbsp;	Non-breaking space
161	241	A1	10100001	¡	&#161;	&iexcl;	Inverted exclamation mark
162	242	A2	10100010	¢	&#162;	&cent;	Cent sign
163	243	A3	10100011	£	&#163;	&pound;	Pound sign
164	244	A4	10100100	¤	&#164;	&curren;	Currency sign
165	245	A5	10100101	¥	&#165;	&yen;	Yen sign
166	246	A6	10100110	¦	&#166;	&brvbar;	Pipe, Broken vertical bar
167	247	A7	10100111	§	&#167;	&sect;	Section sign
168	250	A8	10101000	¨	&#168;	&uml;	Spacing diaeresis - umlaut
169	251	A9	10101001	©	&#169;	&copy;	Copyright sign
170	252	AA	10101010	ª	&#170;	&ordf;	Feminine ordinal indicator
171	253	AB	10101011	«	&#171;	&laquo;	Left double angle quotes
172	254	AC	10101100	¬	&#172;	&not;	Not sign
173	255	AD	10101101		&#173;	&shy;	Soft hyphen
174	256	AE	10101110	®	&#174;	&reg;	Registered trade mark sign
175	257	AF	10101111	¯	&#175;	&macr;	Spacing macron - overline
176	260	B0	10110000	°	&#176;	&deg;	Degree sign
177	261	B1	10110001	±	&#177;	&plusmn;	Plus-or-minus sign
178	262	B2	10110010	²	&#178;	&sup2;	Superscript two - squared
179	263	B3	10110011	³	&#179;	&sup3;	Superscript three - cubed
180	264	B4	10110100	´	&#180;	&acute;	Acute accent - spacing acute
181	265	B5	10110101	µ	&#181;	&micro;	Micro sign
182	266	B6	10110110	¶	&#182;	&para;	Pilcrow sign - paragraph sign
183	267	B7	10110111	·	&#183;	&middot;	Middle dot - Georgian comma
184	270	B8	10111000	¸	&#184;	&cedil;	Spacing cedilla
185	271	B9	10111001	¹	&#185;	&sup1;	Superscript one
186	272	BA	10111010	º	&#186;	&ordm;	Masculine ordinal indicator
187	273	BB	10111011	»	&#187;	&raquo;	Right double angle quotes
188	274	BC	10111100	¼	&#188;	&frac14;	Fraction one quarter
189	275	BD	10111101	½	&#189;	&frac12;	Fraction one half
190	276	BE	10111110	¾	&#190;	&frac34;	Fraction three quarters
191	277	BF	10111111	¿	&#191;	&iquest;	Inverted question mark
192	300	C0	11000000	À	&#192;	&Agrave;	Latin capital letter A with grave
193	301	C1	11000001	Á	&#193;	&Aacute;	Latin capital letter A with acute
194	302	C2	11000010	Â	&#194;	&Acirc;	Latin capital letter A with circumflex
195	303	C3	11000011	Ã	&#195;	&Atilde;	Latin capital letter A with tilde
196	304	C4	11000100	Ä	&#196;	&Auml;	Latin capital letter A with diaeresis
197	305	C5	11000101	Å	&#197;	&Aring;	Latin capital letter A with ring above
198	306	C6	11000110	Æ	&#198;	&AElig;	Latin capital letter AE
199	307	C7	11000111	Ç	&#199;	&Ccedil;	Latin capital letter C with cedilla
200	310	C8	11001000	È	&#200;	&Egrave;	Latin capital letter E with grave
201	311	C9	11001001	É	&#201;	&Eacute;	Latin capital letter E with acute
202	312	CA	11001010	Ê	&#202;	&Ecirc;	Latin capital letter E with circumflex
203	313	CB	11001011	Ë	&#203;	&Euml;	Latin capital letter E with diaeresis
204	314	CC	11001100	Ì	&#204;	&Igrave;	Latin capital letter I with grave
205	315	CD	11001101	Í	&#205;	&Iacute;	Latin capital letter I with acute
206	316	CE	11001110	Î	&#206;	&Icirc;	Latin capital letter I with circumflex
207	317	CF	11001111	Ï	&#207;	&Iuml;	Latin capital letter I with diaeresis
208	320	D0	11010000	Ð	&#208;	&ETH;	Latin capital letter ETH
209	321	D1	11010001	Ñ	&#209;	&Ntilde;	Latin capital letter N with tilde
210	322	D2	11010010	Ò	&#210;	&Ograve;	Latin capital letter O with grave
211	323	D3	11010011	Ó	&#211;	&Oacute;	Latin capital letter O with acute
212	324	D4	11010100	Ô	&#212;	&Ocirc;	Latin capital letter O with circumflex
213	325	D5	11010101	Õ	&#213;	&Otilde;	Latin capital letter O with tilde
214	326	D6	11010110	Ö	&#214;	&Ouml;	Latin capital letter O with diaeresis
215	327	D7	11010111	×	&#215;	&times;	Multiplication sign
216	330	D8	11011000	Ø	&#216;	&Oslash;	Latin capital letter O with slash
217	331	D9	11011001	Ù	&#217;	&Ugrave;	Latin capital letter U with grave
218	332	DA	11011010	Ú	&#218;	&Uacute;	Latin capital letter U with acute
219	333	DB	11011011	Û	&#219;	&Ucirc;	Latin capital letter U with circumflex
220	334	DC	11011100	Ü	&#220;	&Uuml;	Latin capital letter U with diaeresis
221	335	DD	11011101	Ý	&#221;	&Yacute;	Latin capital letter Y with acute
222	336	DE	11011110	Þ	&#222;	&THORN;	Latin capital letter THORN
223	337	DF	11011111	ß	&#223;	&szlig;	Latin small letter sharp s - ess-zed
224	340	E0	11100000	à	&#224;	&agrave;	Latin small letter a with grave
225	341	E1	11100001	á	&#225;	&aacute;	Latin small letter a with acute
226	342	E2	11100010	â	&#226;	&acirc;	Latin small letter a with circumflex
227	343	E3	11100011	ã	&#227;	&atilde;	Latin small letter a with tilde
228	344	E4	11100100	ä	&#228;	&auml;	Latin small letter a with diaeresis
229	345	E5	11100101	å	&#229;	&aring;	Latin small letter a with ring above
230	346	E6	11100110	æ	&#230;	&aelig;	Latin small letter ae
231	347	E7	11100111	ç	&#231;	&ccedil;	Latin small letter c with cedilla
232	350	E8	11101000	è	&#232;	&egrave;	Latin small letter e with grave
233	351	E9	11101001	é	&#233;	&eacute;	Latin small letter e with acute
234	352	EA	11101010	ê	&#234;	&ecirc;	Latin small letter e with circumflex
235	353	EB	11101011	ë	&#235;	&euml;	Latin small letter e with diaeresis
236	354	EC	11101100	ì	&#236;	&igrave;	Latin small letter i with grave
237	355	ED	11101101	í	&#237;	&iacute;	Latin small letter i with acute
238	356	EE	11101110	î	&#238;	&icirc;	Latin small letter i with circumflex
239	357	EF	11101111	ï	&#239;	&iuml;	Latin small letter i with diaeresis
240	360	F0	11110000	ð	&#240;	&eth;	Latin small letter eth
241	361	F1	11110001	ñ	&#241;	&ntilde;	Latin small letter n with tilde
242	362	F2	11110010	ò	&#242;	&ograve;	Latin small letter o with grave
243	363	F3	11110011	ó	&#243;	&oacute;	Latin small letter o with acute
244	364	F4	11110100	ô	&#244;	&ocirc;	Latin small letter o with circumflex
245	365	F5	11110101	õ	&#245;	&otilde;	Latin small letter o with tilde
246	366	F6	11110110	ö	&#246;	&ouml;	Latin small letter o with diaeresis
247	367	F7	11110111	÷	&#247;	&divide;	Division sign
248	370	F8	11111000	ø	&#248;	&oslash;	Latin small letter o with slash
249	371	F9	11111001	ù	&#249;	&ugrave;	Latin small letter u with grave
250	372	FA	11111010	ú	&#250;	&uacute;	Latin small letter u with acute
251	373	FB	11111011	û	&#251;	&ucirc;	Latin small letter u with circumflex
252	374	FC	11111100	ü	&#252;	&uuml;	Latin small letter u with diaeresis
253	375	FD	11111101	ý	&#253;	&yacute;	Latin small letter y with acute
254	376	FE	11111110	þ	&#254;	&thorn;	Latin small letter thorn
255	377	FF	11111111	ÿ	&#255;	&yuml;	Latin small letter y with diaeresis


128	200	80	10000000	 €	&#128;	&euro;	 Euro sign
129	201	 81	10000001	 	 	  	 
130	 202	82	10000010	‚	 &#130;	&sbquo;	Single low-9 quotation mark
131	203	83	10000011	 ƒ	&#131;	&fnof;	 Latin small letter f with hook
132	204	 84	10000100	„	&#132;	&bdquo;	Double low-9 quotation mark
133	205	85	10000101	 …	&#133;	&hellip;	 Horizontal ellipsis
134	206	 86	10000110	†	&#134;	&dagger;	Dagger
135	207	87	10000111	 ‡	&#135;	&Dagger;	 Double dagger
136	210	 88	10001000	ˆ	&#136;	&circ;	Modifier letter circumflex accent
137	211	89	10001001	 ‰	&#137;	&permil;	 Per mille sign
138	212	 8A	10001010	Š	&#138;	&Scaron;	Latin capital letter S with caron
139	213	8B	10001011	 ‹	&#139;	&lsaquo;	 Single left-pointing angle quotation
140	214	 8C	10001100	Œ	&#140;	&OElig;	Latin capital ligature OE
141	215	8D	10001101	  	 	 	  
142	216	8E	10001110	Ž	&#142;	  	Latin captial letter Z with caron
143	 217	8F	10001111	 	  	 	 
144	220	90	10010000	  	 	 	  
145	221	91	10010001	‘	&#145;	 &lsquo;	Left single quotation mark
146	 222	92	10010010	’	 &#146;	&rsquo;	Right single quotation mark
147	223	93	10010011	 “	&#147;	&ldquo;	 Left double quotation mark
148	224	 94	10010100	”	&#148;	&rdquo;	Right double quotation mark
149	225	95	10010101	 •	&#149;	&bull;	 Bullet
150	226	96	10010110	–	&#150;	 &ndash;	En dash
151	 227	97	10010111	—	 &#151;	&mdash;	Em dash
152	230	98	10011000	 ˜	&#152;	&tilde;	 Small tilde
153	231	 99	10011001	™	&#153;	&trade;	Trade mark sign
154	232	9A	10011010	 š	&#154;	&scaron;	 Latin small letter S with caron
155	233	 9B	10011011	›	&#155;	&rsaquo;	Single right-pointing angle quotation mark
156	234	9C	10011100	 œ	&#156;	&oelig;	 Latin small ligature oe
157	235	 9D	10011101	 	 	  	 
158	 236	9E	10011110	ž	 &#158;	 	Latin small letter z with caron
159	237	9F	10011111	 Ÿ	&#159;	&yuml;	 Latin capital letter Y with diaeresis
160	240	 A0	10100000	 	&#160;	&nbsp;	Non-breaking space
161	241	A1	10100001	 ¡	&#161;	&iexcl;	 Inverted exclamation mark
162	242	 A2	10100010	¢	&#162;	&cent;	Cent sign
163	243	A3	10100011	 £	&#163;	&pound;	 Pound sign
164	244	 A4	10100100	¤	&#164;	&curren;	Currency sign
165	245	A5	10100101	 ¥	&#165;	&yen;	 Yen sign
166	246	 A6	10100110	¦	&#166;	&brvbar;	Pipe, Broken vertical bar
167	247	A7	10100111	 §	&#167;	&sect;	 Section sign
168	250	 A8	10101000	¨	&#168;	&uml;	Spacing diaeresis - umlaut
169	251	A9	10101001	 ©	&#169;	&copy;	 Copyright sign
170	252	 AA	10101010	ª	&#170;	&ordf;	Feminine ordinal indicator
171	253	AB	10101011	 «	&#171;	&laquo;	 Left double angle quotes
172	254	 AC	10101100	¬	&#172;	&not;	Not sign
173	255	AD	10101101		&#173;	&shy;	 Soft hyphen
174	256	 AE	10101110	®	&#174;	&reg;	Registered trade mark sign
175	257	AF	10101111	 ¯	&#175;	&macr;	 Spacing macron - overline
176	260	 B0	10110000	°	&#176;	&deg;	Degree sign
177	261	B1	10110001	 ±	&#177;	&plusmn;	 Plus-or-minus sign
178	262	 B2	10110010	²	&#178;	&sup2;	Superscript two - squared
179	263	B3	10110011	 ³	&#179;	&sup3;	 Superscript three - cubed
180	264	 B4	10110100	´	&#180;	&acute;	Acute accent - spacing acute
181	265	B5	10110101	 µ	&#181;	&micro;	 Micro sign
182	266	 B6	10110110	¶	&#182;	&para;	Pilcrow sign - paragraph sign
183	267	B7	10110111	 ·	&#183;	&middot;	 Middle dot - Georgian comma
184	270	 B8	10111000	¸	&#184;	&cedil;	Spacing cedilla
185	271	B9	10111001	 ¹	&#185;	&sup1;	 Superscript one
186	272	 BA	10111010	º	&#186;	&ordm;	Masculine ordinal indicator
187	273	BB	10111011	 »	&#187;	&raquo;	 Right double angle quotes
188	274	 BC	10111100	¼	&#188;	&frac14;	Fraction one quarter
189	275	BD	10111101	 ½	&#189;	&frac12;	 Fraction one half
190	276	 BE	10111110	¾	&#190;	&frac34;	Fraction three quarters
191	277	BF	10111111	 ¿	&#191;	&iquest;	 Inverted question mark
192	300	 C0	11000000	À	&#192;	&Agrave;	Latin capital letter A with grave
193	301	C1	11000001	 Á	&#193;	&Aacute;	 Latin capital letter A with acute
194	302	 C2	11000010	Â	&#194;	&Acirc;	Latin capital letter A with circumflex
195	303	C3	11000011	 Ã	&#195;	&Atilde;	 Latin capital letter A with tilde
196	304	 C4	11000100	Ä	&#196;	&Auml;	Latin capital letter A with diaeresis
197	305	C5	11000101	 Å	&#197;	&Aring;	 Latin capital letter A with ring above
198	306	 C6	11000110	Æ	&#198;	&AElig;	Latin capital letter AE
199	307	C7	11000111	 Ç	&#199;	&Ccedil;	 Latin capital letter C with cedilla
200	310	 C8	11001000	È	&#200;	&Egrave;	Latin capital letter E with grave
201	311	C9	11001001	 É	&#201;	&Eacute;	 Latin capital letter E with acute
202	312	 CA	11001010	Ê	&#202;	&Ecirc;	Latin capital letter E with circumflex
203	313	CB	11001011	 Ë	&#203;	&Euml;	 Latin capital letter E with diaeresis
204	314	 CC	11001100	Ì	&#204;	&Igrave;	Latin capital letter I with grave
205	315	CD	11001101	 Í	&#205;	&Iacute;	 Latin capital letter I with acute
206	316	 CE	11001110	Î	&#206;	&Icirc;	Latin capital letter I with circumflex
207	317	CF	11001111	 Ï	&#207;	&Iuml;	 Latin capital letter I with diaeresis
208	320	 D0	11010000	Ð	&#208;	&ETH;	Latin capital letter ETH
209	321	D1	11010001	 Ñ	&#209;	&Ntilde;	 Latin capital letter N with tilde
210	322	 D2	11010010	Ò	&#210;	&Ograve;	Latin capital letter O with grave
211	323	D3	11010011	 Ó	&#211;	&Oacute;	 Latin capital letter O with acute
212	324	 D4	11010100	Ô	&#212;	&Ocirc;	Latin capital letter O with circumflex
213	325	D5	11010101	 Õ	&#213;	&Otilde;	 Latin capital letter O with tilde
214	326	 D6	11010110	Ö	&#214;	&Ouml;	Latin capital letter O with diaeresis
215	327	D7	11010111	 ×	&#215;	&times;	 Multiplication sign
216	330	 D8	11011000	Ø	&#216;	&Oslash;	Latin capital letter O with slash
217	331	D9	11011001	 Ù	&#217;	&Ugrave;	 Latin capital letter U with grave
218	332	 DA	11011010	Ú	&#218;	&Uacute;	Latin capital letter U with acute
219	333	DB	11011011	 Û	&#219;	&Ucirc;	 Latin capital letter U with circumflex
220	334	 DC	11011100	Ü	&#220;	&Uuml;	Latin capital letter U with diaeresis
221	335	DD	11011101	 Ý	&#221;	&Yacute;	 Latin capital letter Y with acute
222	336	 DE	11011110	Þ	&#222;	&THORN;	Latin capital letter THORN
223	337	DF	11011111	 ß	&#223;	&szlig;	 Latin small letter sharp s - ess-zed
224	340	 E0	11100000	à	&#224;	&agrave;	Latin small letter a with grave
225	341	E1	11100001	 á	&#225;	&aacute;	 Latin small letter a with acute
226	342	 E2	11100010	â	&#226;	&acirc;	Latin small letter a with circumflex
227	343	E3	11100011	 ã	&#227;	&atilde;	 Latin small letter a with tilde
228	344	 E4	11100100	ä	&#228;	&auml;	Latin small letter a with diaeresis
229	345	E5	11100101	 å	&#229;	&aring;	 Latin small letter a with ring above
230	346	 E6	11100110	æ	&#230;	&aelig;	Latin small letter ae
231	347	E7	11100111	 ç	&#231;	&ccedil;	 Latin small letter c with cedilla
232	350	 E8	11101000	è	&#232;	&egrave;	Latin small letter e with grave
233	351	E9	11101001	 é	&#233;	&eacute;	 Latin small letter e with acute
234	352	 EA	11101010	ê	&#234;	&ecirc;	Latin small letter e with circumflex
235	353	EB	11101011	 ë	&#235;	&euml;	 Latin small letter e with diaeresis
236	354	 EC	11101100	ì	&#236;	&igrave;	Latin small letter i with grave
237	355	ED	11101101	 í	&#237;	&iacute;	 Latin small letter i with acute
238	356	 EE	11101110	î	&#238;	&icirc;	Latin small letter i with circumflex
239	357	EF	11101111	 ï	&#239;	&iuml;	 Latin small letter i with diaeresis
240	360	 F0	11110000	ð	&#240;	&eth;	Latin small letter eth
241	361	F1	11110001	 ñ	&#241;	&ntilde;	 Latin small letter n with tilde
242	362	 F2	11110010	ò	&#242;	&ograve;	Latin small letter o with grave
243	363	F3	11110011	 ó	&#243;	&oacute;	 Latin small letter o with acute
244	364	 F4	11110100	ô	&#244;	&ocirc;	Latin small letter o with circumflex
245	365	F5	11110101	 õ	&#245;	&otilde;	 Latin small letter o with tilde
246	366	 F6	11110110	ö	&#246;	&ouml;	Latin small letter o with diaeresis
247	367	F7	11110111	 ÷	&#247;	&divide;	 Division sign
248	370	 F8	11111000	ø	&#248;	&oslash;	Latin small letter o with slash
249	371	F9	11111001	 ù	&#249;	&ugrave;	 Latin small letter u with grave
250	372	 FA	11111010	ú	&#250;	&uacute;	Latin small letter u with acute
251	373	FB	11111011	 û	&#251;	&ucirc;	 Latin small letter u with circumflex
252	374	 FC	11111100	ü	&#252;	&uuml;	Latin small letter u with diaeresis
253	375	FD	11111101	 ý	&#253;	&yacute;	 Latin small letter y with acute
254	376	 FE	11111110	þ	&#254;	&thorn;	Latin small letter thorn
255	377	FF	11111111	 ÿ	&#255;	&yuml;	 Latin small letter y with diaeresis



*/	
	
	
	
	
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
	var scaled = unscaled/max;
	//console.log("Scaled: "+scaled);
	var range =(theVar.scalemax-theVar.scalemin);
	//console.log("Range: "+range);
	//console.log("R*S: "+(range*scaled));
	
	var number = (range*scaled)-(0-theVar.scalemin);	
//	return ((theVar.scalemax-theVar.scalemin)*scaled)-theVar.scalemax;
//	return number+" "+(range*scaled)-(0-theVar.scalemin)+" Unshifted: "+(range*scaled)+" - percentage: "+unscaled/max+" -unscaled is: "+unscaled+" ("+theString.substr(((theVar.offset-offset)*8),(theVar.size)*8)+")";

	return number.toFixed(4);
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
	variables[36] = {offset:89, size:2, name:"i_MHX", description:"current of MHX",unit: "mAmp",scalemin:"0",scalemax:"1023",};
	variables[37] = {offset:91, size:2, name:"i_ADCS", description:"current of ADCS",unit: "mAmp",scalemin:"0",scalemax:"1023",};
	variables[38] = {offset:93, size:2, name:"i_solarXp", description:"current of Solar Panel X+",unit: "mAmp",scalemin:"0",scalemax:"1023",};
	variables[39] = {offset:95, size:2, name:"i_solarXn", description:"current of solar panel X-",unit: "mAmp",scalemin:"0",scalemax:"1023",};
	variables[40] = {offset:97, size:2, name:"i_solarYp", description:"current of solar panel Y+",unit: "mAmp",scalemin:"0",scalemax:"1023",};
	variables[41] = {offset:99, size:2, name:"i_solarYn", description:"current of solar panel Y-",unit: "mAmp",scalemin:"0",scalemax:"1023",};
	variables[42] = {offset:101, size:2, name:"i_solarZp", description:"current of solar panel Z+",unit: "mAmp",scalemin:"0",scalemax:"1023",};
	variables[43] = {offset:103, size:2, name:"i_solarZn", description:"current of solar panel Z-",unit: "mAmp",scalemin:"0",scalemax:"1023",};
	variables[44] = {offset:105, size:2, name:"t_phone", description:"temperature of phone board",unit: "C",scalemin:"0",scalemax:"1023",};
	variables[45] = {offset:107, size:2, name:"t_ADCS_MHX", description:"temperature of ADCS_MHX board",unit: "C",scalemin:"0",scalemax:"1023",};
	variables[46] = {offset:109, size:2, name:"t_solarXp", description:"temperature of solar panel X+",unit: "C",scalemin:"0",scalemax:"1023",};
	variables[47] = {offset:111, size:2, name:"t_solarXn", description:"temperature of solar panel X-",unit: "C",scalemin:"0",scalemax:"1023",};
	variables[48] = {offset:113, size:2, name:"t_solarYp", description:"temperature of solar panel Y+",unit: "C",scalemin:"0",scalemax:"1023",};
	variables[49] = {offset:115, size:2, name:"t_solarYn", description:"temperature of solar panel Y-",unit: "C",scalemin:"0",scalemax:"1023",};
	variables[50] = {offset:117, size:2, name:"t_solarZp", description:"temperature of solar panel Z+",unit: "C",scalemin:"0",scalemax:"1023",};
	variables[51] = {offset:119, size:2, name:"t_solarZn", description:"temperature of solar panel Z-",unit: "C",scalemin:"0",scalemax:"1023",};	
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