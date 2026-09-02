'use client';

import { useState } from 'react';

const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+917975630631';
const EMAIL = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'networkingtoursandtravels@gmail.com';

// 382 coverage areas (0-5 km buffer, Bengaluru). Suffix rotates evenly across
// "Taxi" / "Cabs" / "Taxi Service" for natural keyword variation instead of
// repeating the same phrase 382 times (which reads as keyword stuffing to
// Google and to visitors). `popular` marks the ~24 shown by default; the rest
// appear once "View all areas" is expanded.
const AREAS = [
  { name: 'Kempegowda International Airport (KIAB)', suffix: 'Taxi', popular: true },
  { name: 'Devanahalli Town', suffix: 'Cabs', popular: false },
  { name: 'Devanahalli Aerospace Park', suffix: 'Taxi Service', popular: false },
  { name: 'KIADB Industrial Area Devanahalli', suffix: 'Taxi', popular: false },
  { name: 'Trumpet Flyover Zone', suffix: 'Cabs', popular: false },
  { name: 'Nandi Hills Base', suffix: 'Taxi Service', popular: false },
  { name: 'Nandi Hills Top', suffix: 'Taxi', popular: false },
  { name: 'Chikkaballapur Town', suffix: 'Cabs', popular: false },
  { name: 'Muddenahalli', suffix: 'Taxi Service', popular: false },
  { name: 'Vijayapura Town', suffix: 'Taxi', popular: false },
  { name: 'Rajanukunte', suffix: 'Cabs', popular: false },
  { name: 'Kakolu', suffix: 'Taxi Service', popular: false },
  { name: 'Doddaballapur Town', suffix: 'Taxi', popular: false },
  { name: 'Doddaballapur Apparel Park', suffix: 'Cabs', popular: false },
  { name: 'Makalidurga', suffix: 'Taxi Service', popular: false },
  { name: 'Tubagere', suffix: 'Taxi', popular: false },
  { name: 'Yelahanka Old Town', suffix: 'Cabs', popular: false },
  { name: 'Yelahanka New Town', suffix: 'Taxi Service', popular: true },
  { name: 'Yelahanka Air Force Station Zone', suffix: 'Taxi', popular: false },
  { name: 'Kogilu', suffix: 'Cabs', popular: false },
  { name: 'Kogilu Cross', suffix: 'Taxi Service', popular: false },
  { name: 'Kattigenahalli', suffix: 'Taxi', popular: false },
  { name: 'Bagalur Village (North)', suffix: 'Cabs', popular: false },
  { name: 'Bagalur Cross', suffix: 'Taxi Service', popular: false },
  { name: 'Thanisandra', suffix: 'Taxi', popular: false },
  { name: 'Thanisandra Main Road', suffix: 'Cabs', popular: false },
  { name: 'Bharatiya City Area', suffix: 'Taxi Service', popular: false },
  { name: 'Hegde Nagar', suffix: 'Taxi', popular: false },
  { name: 'Reva University Area', suffix: 'Cabs', popular: false },
  { name: 'Jakkur', suffix: 'Taxi Service', popular: false },
  { name: 'Jakkur Aerodrome Area', suffix: 'Taxi', popular: false },
  { name: 'Amruthahalli', suffix: 'Cabs', popular: false },
  { name: 'Sahakar Nagar', suffix: 'Taxi Service', popular: false },
  { name: 'Hebbal', suffix: 'Taxi', popular: true },
  { name: 'Hebbal Kempapura', suffix: 'Cabs', popular: false },
  { name: 'Nagavara', suffix: 'Taxi Service', popular: false },
  { name: 'Manyata Tech Park Zone', suffix: 'Taxi', popular: false },
  { name: 'Hennur', suffix: 'Cabs', popular: true },
  { name: 'Hennur Cross', suffix: 'Taxi Service', popular: false },
  { name: 'Kothanur', suffix: 'Taxi', popular: false },
  { name: 'Geddalahalli', suffix: 'Cabs', popular: false },
  { name: 'Horamavu', suffix: 'Taxi Service', popular: false },
  { name: 'Horamavu Agara', suffix: 'Taxi', popular: false },
  { name: 'Babusapalya', suffix: 'Cabs', popular: false },
  { name: 'Chikka Banaswadi', suffix: 'Taxi Service', popular: false },
  { name: 'Banaswadi', suffix: 'Taxi', popular: false },
  { name: 'HRBR Layout', suffix: 'Cabs', popular: false },
  { name: 'Kammanahalli', suffix: 'Taxi Service', popular: false },
  { name: 'Lingarajapuram', suffix: 'Taxi', popular: false },
  { name: 'Thomas Town', suffix: 'Cabs', popular: false },
  { name: 'Cox Town', suffix: 'Taxi Service', popular: false },
  { name: 'Fraser Town (Pulakeshinagar)', suffix: 'Taxi', popular: false },
  { name: 'R.T. Nagar', suffix: 'Cabs', popular: true },
  { name: 'Kaval Byrasandra', suffix: 'Taxi Service', popular: false },
  { name: 'Sultanpalya', suffix: 'Taxi', popular: false },
  { name: 'Ganganagar', suffix: 'Cabs', popular: false },
  { name: 'Sanjay Nagar', suffix: 'Taxi Service', popular: false },
  { name: 'Dollars Colony (RMV 2nd Stage)', suffix: 'Taxi', popular: false },
  { name: 'New BEL Road', suffix: 'Cabs', popular: false },
  { name: 'Mathikere', suffix: 'Taxi Service', popular: false },
  { name: 'MSRIT / M.S. Ramaiah City', suffix: 'Taxi', popular: false },
  { name: 'Gokula Extension', suffix: 'Cabs', popular: false },
  { name: 'Yeshwanthpur Industrial Suburb', suffix: 'Taxi Service', popular: false },
  { name: 'Sadashivanagar', suffix: 'Taxi', popular: false },
  { name: 'Palace Grounds Zone', suffix: 'Cabs', popular: false },
  { name: 'K.R. Puram', suffix: 'Taxi Service', popular: true },
  { name: 'Tin Factory Junction', suffix: 'Taxi', popular: false },
  { name: 'Ramamurthy Nagar', suffix: 'Cabs', popular: false },
  { name: 'TC Palya', suffix: 'Taxi Service', popular: false },
  { name: 'Bhattarahalli', suffix: 'Taxi', popular: false },
  { name: 'Avalahalli', suffix: 'Cabs', popular: false },
  { name: 'Budigere Cross', suffix: 'Taxi Service', popular: false },
  { name: 'Budigere Village', suffix: 'Taxi', popular: false },
  { name: 'Hoskote Town', suffix: 'Cabs', popular: false },
  { name: 'Hoskote Industrial Area', suffix: 'Taxi Service', popular: false },
  { name: 'Soukya Road Area', suffix: 'Taxi', popular: false },
  { name: 'Pillagumpa Industrial Area', suffix: 'Cabs', popular: false },
  { name: 'Whitefield', suffix: 'Taxi Service', popular: true },
  { name: 'Whitefield Railway Station Zone', suffix: 'Taxi', popular: false },
  { name: 'Hope Farm Junction', suffix: 'Cabs', popular: false },
  { name: 'Kadugodi', suffix: 'Taxi Service', popular: false },
  { name: 'Channasandra (East)', suffix: 'Taxi', popular: false },
  { name: 'ITPL Main Gate Area', suffix: 'Cabs', popular: false },
  { name: 'Hoodi', suffix: 'Taxi Service', popular: false },
  { name: 'Kundalahalli', suffix: 'Taxi', popular: false },
  { name: 'Brookefield', suffix: 'Cabs', popular: false },
  { name: 'AECS Layout', suffix: 'Taxi Service', popular: false },
  { name: 'Marathahalli', suffix: 'Taxi', popular: true },
  { name: 'Marathahalli Bridge Zone', suffix: 'Cabs', popular: false },
  { name: 'Mahadevapura', suffix: 'Taxi Service', popular: false },
  { name: 'Doddanekkundi', suffix: 'Taxi', popular: false },
  { name: 'Varthur', suffix: 'Cabs', popular: false },
  { name: 'Gunjur', suffix: 'Taxi Service', popular: false },
  { name: 'Panathur', suffix: 'Taxi', popular: false },
  { name: 'Balagere', suffix: 'Cabs', popular: false },
  { name: 'Bellandur', suffix: 'Taxi Service', popular: true },
  { name: 'Devarabeesanahalli (ORR)', suffix: 'Taxi', popular: false },
  { name: 'Kadubeesanahalli', suffix: 'Cabs', popular: false },
  { name: 'Kaikondrahalli', suffix: 'Taxi Service', popular: false },
  { name: 'Carmelaram', suffix: 'Taxi', popular: false },
  { name: 'Sarjapur Road', suffix: 'Cabs', popular: true },
  { name: 'Dommasandra', suffix: 'Taxi Service', popular: false },
  { name: 'Sarjapur Town', suffix: 'Taxi', popular: false },
  { name: 'Yamare', suffix: 'Cabs', popular: false },
  { name: 'Mugalur', suffix: 'Taxi Service', popular: false },
  { name: 'Sompura Gate', suffix: 'Taxi', popular: false },
  { name: 'Handenahalli', suffix: 'Cabs', popular: false },
  { name: 'Bagalur (TN Border Sector)', suffix: 'Taxi Service', popular: false },
  { name: 'Old Airport Road', suffix: 'Taxi', popular: true },
  { name: 'HAL Airport Area', suffix: 'Cabs', popular: false },
  { name: 'Murugeshpalya', suffix: 'Taxi Service', popular: false },
  { name: 'Vimanapura', suffix: 'Taxi', popular: false },
  { name: 'Konena Agrahara', suffix: 'Cabs', popular: false },
  { name: 'Domlur', suffix: 'Taxi Service', popular: false },
  { name: 'Indiranagar 1st Stage', suffix: 'Taxi', popular: true },
  { name: 'Indiranagar 2nd Stage', suffix: 'Cabs', popular: false },
  { name: '100 Feet Road Indiranagar', suffix: 'Taxi Service', popular: false },
  { name: 'Thippasandra', suffix: 'Taxi', popular: false },
  { name: 'New Thippasandra', suffix: 'Cabs', popular: false },
  { name: 'CV Raman Nagar', suffix: 'Taxi Service', popular: false },
  { name: 'Kaggadasapura', suffix: 'Taxi', popular: false },
  { name: 'Malleshpalya', suffix: 'Cabs', popular: false },
  { name: 'Ulsoor (Halasuru)', suffix: 'Taxi Service', popular: false },
  { name: 'Trinity Circle Zone', suffix: 'Taxi', popular: false },
  { name: 'MG Road Core Area', suffix: 'Cabs', popular: true },
  { name: 'Brigade Road', suffix: 'Taxi Service', popular: false },
  { name: 'Commercial Street', suffix: 'Taxi', popular: false },
  { name: 'Shivaji Nagar', suffix: 'Cabs', popular: false },
  { name: 'Richmond Town', suffix: 'Taxi Service', popular: false },
  { name: 'Shanthi Nagar', suffix: 'Taxi', popular: false },
  { name: 'Langford Town', suffix: 'Cabs', popular: false },
  { name: 'Ashok Nagar', suffix: 'Taxi Service', popular: false },
  { name: 'Victoria Layout', suffix: 'Taxi', popular: false },
  { name: 'Austin Town', suffix: 'Cabs', popular: false },
  { name: 'Neelasandra', suffix: 'Taxi Service', popular: false },
  { name: 'Koramangala 1st Block', suffix: 'Taxi', popular: false },
  { name: 'Koramangala 4th Block', suffix: 'Cabs', popular: true },
  { name: 'Koramangala 5th & 6th Block', suffix: 'Taxi Service', popular: false },
  { name: 'Koramangala 7th & 8th Block', suffix: 'Taxi', popular: false },
  { name: 'Ejipura', suffix: 'Cabs', popular: false },
  { name: 'Viveknagar', suffix: 'Taxi Service', popular: false },
  { name: 'National Games Village (NGV)', suffix: 'Taxi', popular: false },
  { name: 'HSR Layout Sector 1 to 3', suffix: 'Cabs', popular: true },
  { name: 'HSR Layout Sector 4 to 7', suffix: 'Taxi Service', popular: false },
  { name: 'Agara Junction Area', suffix: 'Taxi', popular: false },
  { name: 'Kudlu Gate', suffix: 'Cabs', popular: false },
  { name: 'Singasandra', suffix: 'Taxi Service', popular: false },
  { name: 'Parappana Agrahara', suffix: 'Taxi', popular: false },
  { name: 'Electronic City Phase 1', suffix: 'Cabs', popular: true },
  { name: 'Electronic City Phase 2', suffix: 'Taxi Service', popular: false },
  { name: 'Hebbagodi', suffix: 'Taxi', popular: false },
  { name: 'Veersandra', suffix: 'Cabs', popular: false },
  { name: 'Huskur / Huskur Gate', suffix: 'Taxi Service', popular: false },
  { name: 'Chandapura Town', suffix: 'Taxi', popular: false },
  { name: 'Chandapura Circle', suffix: 'Cabs', popular: false },
  { name: 'Attibele Town', suffix: 'Taxi Service', popular: false },
  { name: 'Attibele Industrial Area', suffix: 'Taxi', popular: false },
  { name: 'Hosur Border (TN-KA Checkpost)', suffix: 'Cabs', popular: false },
  { name: 'Jigani Town', suffix: 'Taxi Service', popular: false },
  { name: 'Jigani Industrial Area (APC Circle)', suffix: 'Taxi', popular: false },
  { name: 'Anekal Town', suffix: 'Cabs', popular: false },
  { name: 'Anekal Railway Station Area', suffix: 'Taxi Service', popular: false },
  { name: 'Bommasandra Industrial Area', suffix: 'Taxi', popular: false },
  { name: 'Bommanahalli', suffix: 'Cabs', popular: false },
  { name: 'Mangammanapalya', suffix: 'Taxi Service', popular: false },
  { name: 'Silk Board Junction', suffix: 'Taxi', popular: false },
  { name: 'BTM Layout 1st Stage', suffix: 'Cabs', popular: true },
  { name: 'BTM Layout 2nd Stage', suffix: 'Taxi Service', popular: false },
  { name: 'Tavarekere (BTM Area)', suffix: 'Taxi', popular: false },
  { name: 'Madiwala', suffix: 'Cabs', popular: false },
  { name: 'Jayanagar 1st to 4th Block', suffix: 'Taxi Service', popular: true },
  { name: 'Jayanagar 5th to 9th Block', suffix: 'Taxi', popular: false },
  { name: 'South End Circle', suffix: 'Cabs', popular: false },
  { name: 'JP Nagar Phase 1 to 4', suffix: 'Taxi Service', popular: true },
  { name: 'JP Nagar Phase 5 to 9', suffix: 'Taxi', popular: false },
  { name: 'Sarakki', suffix: 'Cabs', popular: false },
  { name: 'Yelachenahalli', suffix: 'Taxi Service', popular: false },
  { name: 'Konanakunte', suffix: 'Taxi', popular: false },
  { name: 'Konanakunte Cross', suffix: 'Cabs', popular: false },
  { name: 'Anjanapura', suffix: 'Taxi Service', popular: false },
  { name: 'Gottigere', suffix: 'Taxi', popular: false },
  { name: 'Bannerghatta Road (IIMB Zone)', suffix: 'Cabs', popular: true },
  { name: 'Hulimavu', suffix: 'Taxi Service', popular: false },
  { name: 'Begur Town', suffix: 'Taxi', popular: false },
  { name: 'Begur Koppa Road', suffix: 'Cabs', popular: false },
  { name: 'Koppa Gate', suffix: 'Taxi Service', popular: false },
  { name: 'Bannerghatta Village', suffix: 'Taxi', popular: false },
  { name: 'Bannerghatta National Park Zone', suffix: 'Cabs', popular: false },
  { name: 'Ragihalli', suffix: 'Taxi Service', popular: false },
  { name: 'Harapanahalli (Anekal Taluk)', suffix: 'Taxi', popular: false },
  { name: 'Jigani-Anekal Main Road', suffix: 'Cabs', popular: false },
  { name: 'Kanakapura Road Corridor', suffix: 'Taxi Service', popular: true },
  { name: 'Kaggalipura', suffix: 'Taxi', popular: false },
  { name: 'Pattareddypalya', suffix: 'Cabs', popular: false },
  { name: 'Harohalli Industrial Area', suffix: 'Taxi Service', popular: false },
  { name: 'Harohalli Town', suffix: 'Taxi', popular: false },
  { name: 'Maralavadi', suffix: 'Cabs', popular: false },
  { name: 'Kanakapura Town', suffix: 'Taxi Service', popular: false },
  { name: 'Dayananda Sagar University Campus Area', suffix: 'Taxi', popular: false },
  { name: 'Vasudevapura', suffix: 'Cabs', popular: false },
  { name: 'Banashankari 1st Stage', suffix: 'Taxi Service', popular: false },
  { name: 'Banashankari 2nd Stage', suffix: 'Taxi', popular: true },
  { name: 'Banashankari 3rd Stage', suffix: 'Cabs', popular: false },
  { name: 'Banashankari 6th Stage', suffix: 'Taxi Service', popular: false },
  { name: 'Padmanabhanagar', suffix: 'Taxi', popular: false },
  { name: 'Uttarahalli', suffix: 'Cabs', popular: false },
  { name: 'Subramanyapura', suffix: 'Taxi Service', popular: false },
  { name: 'Chikkalasandra', suffix: 'Taxi', popular: false },
  { name: 'Kumaraswamy Layout', suffix: 'Cabs', popular: false },
  { name: 'ISRO Layout', suffix: 'Taxi Service', popular: false },
  { name: 'Nayandahalli', suffix: 'Taxi', popular: false },
  { name: 'Rajarajeshwari Nagar (RR Nagar)', suffix: 'Cabs', popular: false },
  { name: 'RR Nagar Gate', suffix: 'Taxi Service', popular: false },
  { name: 'Kengeri Satellite Town', suffix: 'Taxi', popular: false },
  { name: 'Kengeri Upanagara', suffix: 'Cabs', popular: false },
  { name: 'Kengeri Checkpost', suffix: 'Taxi Service', popular: false },
  { name: 'Challaghatta (Metro End Point)', suffix: 'Taxi', popular: false },
  { name: 'Kumbalgodu Town', suffix: 'Cabs', popular: false },
  { name: 'Kumbalgodu Industrial Area', suffix: 'Taxi Service', popular: false },
  { name: 'Bidadi Town', suffix: 'Taxi', popular: false },
  { name: 'Bidadi Industrial Area (Toyota Plant)', suffix: 'Cabs', popular: false },
  { name: 'Wonderla Area / Hejjala', suffix: 'Taxi Service', popular: false },
  { name: 'Ramanagara Town', suffix: 'Taxi', popular: false },
  { name: 'Channapatna Town', suffix: 'Cabs', popular: false },
  { name: 'Nagarbhavi 1st Stage', suffix: 'Taxi Service', popular: false },
  { name: 'Nagarbhavi 2nd Stage', suffix: 'Taxi', popular: false },
  { name: 'Chandra Layout', suffix: 'Cabs', popular: false },
  { name: 'Vijayanagar', suffix: 'Taxi Service', popular: false },
  { name: 'Hosahalli', suffix: 'Taxi', popular: false },
  { name: 'Attiguppe', suffix: 'Cabs', popular: false },
  { name: 'Bapuji Nagar', suffix: 'Taxi Service', popular: false },
  { name: 'Deepanjali Nagar', suffix: 'Taxi', popular: false },
  { name: 'Mysore Road Flyover Zone', suffix: 'Cabs', popular: false },
  { name: 'Magadi Road Metro Zone', suffix: 'Taxi Service', popular: false },
  { name: 'Kamakshipalya', suffix: 'Taxi', popular: false },
  { name: 'Basaveshwaranagar', suffix: 'Cabs', popular: false },
  { name: 'Rajajinagar 1st to 3rd Block', suffix: 'Taxi Service', popular: true },
  { name: 'Rajajinagar 4th to 6th Block', suffix: 'Taxi', popular: false },
  { name: 'Mahalakshmi Layout', suffix: 'Cabs', popular: false },
  { name: 'Nandini Layout', suffix: 'Taxi Service', popular: false },
  { name: 'Kurubarahalli', suffix: 'Taxi', popular: false },
  { name: 'Shankar Nagar', suffix: 'Cabs', popular: false },
  { name: 'Mahalakshmi Metro Zone', suffix: 'Taxi Service', popular: false },
  { name: 'Gollarahatti', suffix: 'Taxi', popular: false },
  { name: 'Kadabagere', suffix: 'Cabs', popular: false },
  { name: 'Machohalli', suffix: 'Taxi Service', popular: false },
  { name: 'Magadi Town', suffix: 'Taxi', popular: false },
  { name: 'Solur', suffix: 'Cabs', popular: false },
  { name: 'Kudur', suffix: 'Taxi Service', popular: false },
  { name: 'Malleshwaram 1st to 7th Main', suffix: 'Taxi', popular: true },
  { name: 'Malleshwaram 8th to 18th Cross', suffix: 'Cabs', popular: false },
  { name: 'Seshadripuram', suffix: 'Taxi Service', popular: false },
  { name: 'Kumara Park East & West', suffix: 'Taxi', popular: false },
  { name: 'High Grounds Zone', suffix: 'Cabs', popular: false },
  { name: 'Vasanth Nagar', suffix: 'Taxi Service', popular: false },
  { name: 'Sampangiram Nagar', suffix: 'Taxi', popular: false },
  { name: 'Chamarajpet', suffix: 'Cabs', popular: false },
  { name: 'KR Market (City Market)', suffix: 'Taxi Service', popular: false },
  { name: 'Chickpet', suffix: 'Taxi', popular: false },
  { name: 'Yeshwanthpur Town', suffix: 'Cabs', popular: false },
  { name: 'Yeshwanthpur Railway Station Zone', suffix: 'Taxi Service', popular: false },
  { name: 'Goraguntepalya', suffix: 'Taxi', popular: false },
  { name: 'Peenya 1st & 2nd Stage', suffix: 'Cabs', popular: false },
  { name: 'Peenya 3rd & 4th Stage', suffix: 'Taxi Service', popular: false },
  { name: 'Jalahalli Cross', suffix: 'Taxi', popular: false },
  { name: 'Jalahalli East', suffix: 'Cabs', popular: false },
  { name: 'Jalahalli West', suffix: 'Taxi Service', popular: false },
  { name: 'Gangamma Circle', suffix: 'Taxi', popular: false },
  { name: 'Vidyaranyapura', suffix: 'Cabs', popular: false },
  { name: 'Abbigere', suffix: 'Taxi Service', popular: false },
  { name: 'Chikkabanavara', suffix: 'Taxi', popular: false },
  { name: 'Hesaraghatta Village', suffix: 'Cabs', popular: false },
  { name: 'Hesaraghatta Lake Zone', suffix: 'Taxi Service', popular: false },
  { name: 'TB Cross (Hesaraghatta Road)', suffix: 'Taxi', popular: false },
  { name: 'T. Dasarahalli', suffix: 'Cabs', popular: false },
  { name: 'Nagasandra Metro Zone', suffix: 'Taxi Service', popular: false },
  { name: 'Madavara (BIEC - Exhibition Centre)', suffix: 'Taxi', popular: false },
  { name: 'Anchepalya', suffix: 'Cabs', popular: false },
  { name: 'Makali Town', suffix: 'Taxi Service', popular: false },
  { name: 'Nelamangala Town', suffix: 'Taxi', popular: false },
  { name: 'Nelamangala Toll Plaza Area', suffix: 'Cabs', popular: false },
  { name: 'Sondekoppa', suffix: 'Taxi Service', popular: false },
  { name: 'Dobbaspet Industrial Belt', suffix: 'Taxi', popular: false },
  { name: 'Sompura Industrial Area (Dobbaspet)', suffix: 'Cabs', popular: false },
  { name: 'Shivagange Base Zone', suffix: 'Taxi Service', popular: false },
  { name: 'Dyamalamba Temple Zone', suffix: 'Taxi', popular: false },
  { name: 'Thyamagondlu', suffix: 'Cabs', popular: false },
  { name: 'Nijagal Betta Area', suffix: 'Taxi Service', popular: false },
  { name: 'Soldevanahalli', suffix: 'Taxi', popular: false },
  { name: 'Silvepura', suffix: 'Cabs', popular: false },
  { name: 'Tarabanahalli', suffix: 'Taxi Service', popular: false },
  { name: 'Hurulichikkanahalli', suffix: 'Taxi', popular: false },
  { name: 'Soladevanahalli Gate', suffix: 'Cabs', popular: false },
  { name: 'Chikkasandra', suffix: 'Taxi Service', popular: false },
  { name: 'Mallasandra', suffix: 'Taxi', popular: false },
  { name: 'Soundarya Layout Area', suffix: 'Cabs', popular: false },
  { name: 'Nelamangala Rural Belt', suffix: 'Taxi Service', popular: false },
  { name: 'Doddaballapur-Nelamangala Corridor', suffix: 'Taxi', popular: false },
  { name: 'Devanahalli-Doddaballapur Belt', suffix: 'Cabs', popular: false },
  { name: 'Chanalahalli', suffix: 'Taxi Service', popular: false },
  { name: 'Sidlaghatta Road Cross', suffix: 'Taxi', popular: false },
  { name: 'Devangonthi Village', suffix: 'Cabs', popular: false },
  { name: 'Avinahalli', suffix: 'Taxi Service', popular: false },
  { name: 'BIAL Back Gate Road', suffix: 'Taxi', popular: false },
  { name: 'Chikkasana', suffix: 'Cabs', popular: false },
  { name: 'Kundana', suffix: 'Taxi Service', popular: false },
  { name: 'Vijayapura Road Pocket', suffix: 'Taxi', popular: false },
  { name: 'Vishwanathapura', suffix: 'Cabs', popular: false },
  { name: 'Kannamangala', suffix: 'Taxi Service', popular: false },
  { name: 'Chikkajala', suffix: 'Taxi', popular: false },
  { name: 'Shettigere', suffix: 'Cabs', popular: false },
  { name: 'Suthanahalli', suffix: 'Taxi Service', popular: false },
  { name: 'Hennur Outer', suffix: 'Taxi', popular: false },
  { name: 'Byrathi', suffix: 'Cabs', popular: false },
  { name: 'Attur', suffix: 'Taxi Service', popular: false },
  { name: 'Sahakara Nagar', suffix: 'Taxi', popular: false },
  { name: 'Judicial Layout', suffix: 'Cabs', popular: false },
  { name: 'Jajur', suffix: 'Taxi Service', popular: false },
  { name: 'Nagawara', suffix: 'Taxi', popular: false },
  { name: 'Thanisandra Extension', suffix: 'Cabs', popular: false },
  { name: 'T. Begur Inner Pockets', suffix: 'Taxi Service', popular: false },
  { name: 'Arshinakunte Village Belt', suffix: 'Taxi', popular: false },
  { name: 'Makali', suffix: 'Cabs', popular: false },
  { name: 'Dasarahalli', suffix: 'Taxi Service', popular: false },
  { name: 'Chikkabanavara Lake Perimeter', suffix: 'Taxi', popular: false },
  { name: 'Hesaraghatta Main Road', suffix: 'Cabs', popular: false },
  { name: 'Ganapathinagar', suffix: 'Taxi Service', popular: false },
  { name: 'Someshwara Nagar', suffix: 'Taxi', popular: false },
  { name: 'Dodderi', suffix: 'Cabs', popular: false },
  { name: 'Sompura Industrial Area Phase 1', suffix: 'Taxi Service', popular: false },
  { name: 'Sompura Industrial Area Phase 2', suffix: 'Taxi', popular: false },
  { name: 'Madanayakanahalli', suffix: 'Cabs', popular: false },
  { name: 'Magadi Road Crossing Pockets', suffix: 'Taxi Service', popular: false },
  { name: 'Sulibele Bypass', suffix: 'Taxi', popular: false },
  { name: 'Pillagumpa Industrial Phase 2', suffix: 'Cabs', popular: false },
  { name: 'Devangonthi Station Road', suffix: 'Taxi Service', popular: false },
  { name: 'Samanthur', suffix: 'Taxi', popular: false },
  { name: 'Mugabala Village', suffix: 'Cabs', popular: false },
  { name: 'Hope Farm Extension', suffix: 'Taxi Service', popular: false },
  { name: 'Kadugodi Industrial Area', suffix: 'Taxi', popular: false },
  { name: 'Belathur', suffix: 'Cabs', popular: false },
  { name: 'Seegehalli', suffix: 'Taxi Service', popular: false },
  { name: 'Sulibele Town', suffix: 'Taxi', popular: false },
  { name: 'Katmurayutha Kote', suffix: 'Cabs', popular: false },
  { name: 'Varthur Outer Belt', suffix: 'Taxi Service', popular: false },
  { name: 'Kadugodi Extension', suffix: 'Taxi', popular: false },
  { name: 'NR Pura', suffix: 'Cabs', popular: false },
  { name: 'Varthur Kodi', suffix: 'Taxi Service', popular: false },
  { name: 'Dommasandra Circle', suffix: 'Taxi', popular: false },
  { name: 'Muthanasandra', suffix: 'Cabs', popular: false },
  { name: 'Sarjapur Layout Phase 2', suffix: 'Taxi Service', popular: false },
  { name: 'CMR Road Outer', suffix: 'Taxi', popular: false },
  { name: 'Munnekollal', suffix: 'Cabs', popular: false },
  { name: 'Bellandur Outer Ring Buffer', suffix: 'Taxi Service', popular: false },
  { name: 'Sarjapur-Attibele Road Belt', suffix: 'Taxi', popular: false },
  { name: 'Hebbagodi Town', suffix: 'Cabs', popular: false },
  { name: 'Veerasandra Industrial Zone', suffix: 'Taxi Service', popular: false },
  { name: 'Huskur Cross', suffix: 'Taxi', popular: false },
  { name: 'Madivala Attibele Pass', suffix: 'Cabs', popular: false },
  { name: 'Yandahalli', suffix: 'Taxi Service', popular: false },
  { name: 'Bidaraguppe', suffix: 'Taxi', popular: false },
  { name: 'Anekal Road Pockets', suffix: 'Cabs', popular: false },
  { name: 'Jujuwadi Border Pocket', suffix: 'Taxi Service', popular: false },
  { name: 'SIPCOT Phase 1 Hosur', suffix: 'Taxi', popular: false },
  { name: 'SIPCOT Phase 2 Hosur', suffix: 'Cabs', popular: false },
  { name: 'Jigani 1st Phase Industrial Area', suffix: 'Taxi Service', popular: false },
  { name: 'Jigani 2nd Phase Industrial Area', suffix: 'Taxi', popular: false },
  { name: 'Bannerghatta Buffer Zone', suffix: 'Cabs', popular: false },
  { name: 'Haragadde', suffix: 'Taxi Service', popular: false },
  { name: 'Koppel Village', suffix: 'Taxi', popular: false },
  { name: 'Bommasandra Industrial Extension', suffix: 'Cabs', popular: false },
  { name: 'Muthenahalli', suffix: 'Taxi Service', popular: false },
  { name: 'Bannerghatta Outer Buffer', suffix: 'Taxi', popular: false },
  { name: 'Ramanagara Corridor Start', suffix: 'Cabs', popular: false },
  { name: 'Kengeri Satellite Town 5th Stage', suffix: 'Taxi Service', popular: false },
  { name: 'Rajarajeshwari Nagar Outer', suffix: 'Taxi', popular: false },
  { name: 'Tholuhunase', suffix: 'Cabs', popular: false },
  { name: 'Sunkadakatte', suffix: 'Taxi Service', popular: false },
  { name: 'Herohalli', suffix: 'Taxi', popular: false },
  { name: 'Gandinagar Nelamangala Link', suffix: 'Cabs', popular: false },
  { name: 'Muddayanapalya', suffix: 'Taxi Service', popular: false },
  { name: 'Doddaballapur-Devanahalli Connecting Cross', suffix: 'Taxi', popular: false },
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[()/&]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// NOTE: links point to `/?dest=<Area Name>` on the homepage. This assumes the
// homepage's route search reads a `dest` query param to prefill the
// destination field. If the actual param name is different, tell me and
// I'll update AREA_HREF in one place.
function areaHref(area) {
  return `/?dest=${encodeURIComponent(area.name)}#book`;
}

const TRUST_BADGES = [
  { icon: '📍', label: 'Live GPS Tracking' },
  { icon: '🧼', label: 'Clean, Sanitized Cabs' },
  { icon: '🛡️', label: 'Verified Drivers' },
  { icon: '💳', label: 'Flexible Payment: ₹0 / 25% / 100% Advance' },
];

export default function Footer() {
  const [showAllAreas, setShowAllAreas] = useState(false);
  const popularAreas = AREAS.filter((a) => a.popular);
  const visibleAreas = showAllAreas ? AREAS : popularAreas;

  return (
    <footer className="bg-route-teal text-white">
      <div className="mx-auto max-w-6xl px-5 pt-14">
        <p className="max-w-3xl text-sm leading-relaxed text-white/80">
          Networking Tours &amp; Travels is Bengaluru&rsquo;s trusted taxi and tours &amp; travels
          partner &mdash; luxury taxi &amp; bus rentals across Dzire, Etios, Innova Crysta and Tempo
          Traveller, with live GPS tracking, professional captains and transparent, on-time
          pickups. Book your one way, round trip, outstation, hourly or airport taxi in Bangalore
          online in a few taps, with 100% on-time pickup and a trusted cab service across the city.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium"
            >
              <span aria-hidden="true" className="text-lg">{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
        <a
          href="https://www.google.com/maps/place/?q=place_id:REPLACE_WITH_GOOGLE_PLACE_ID"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/25"
        >
          ★ 4.9 rated &middot; 161 Google reviews
        </a>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-10 sm:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="font-display text-lg font-bold">Networking Tours &amp; Travels</div>
          <p className="mt-3 text-sm text-white/75">
            No 23 Saraipalya, Thanisandra Main Rd, Sinthan Nagar, Bharath Nagar,
            Manyata Tech Park, Thanisandra, Bengaluru, Karnataka 560077
          </p>
        </div>
        <div>
          <div className="font-display text-xs font-bold uppercase tracking-wide text-white/60">
            Get in touch
          </div>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>
              <a className="hover:text-white" href={`tel:${PHONE}`}>📞 {PHONE}</a>
            </li>
            <li>
              <a className="hover:text-white" href={`mailto:${EMAIL}`}>✉️ {EMAIL}</a>
            </li>
            <li>
              <a className="hover:text-white" href="/my-bookings">Track my booking</a>
            </li>
            <li>
              <a className="hover:text-white" href="/group-booking">Bus / tempo traveller enquiry</a>
            </li>
            <li>
              <a className="hover:text-white" href="/admin">Admin login</a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-display text-xs font-bold uppercase tracking-wide text-white/60">
            Fleet
          </div>
          <ul className="mt-3 space-y-1 text-sm text-white/85">
            <li>Swift Dzire / Etios / Sunny — Sedan</li>
            <li>Ertiga / Innova — SUV</li>
            <li>Innova Crysta</li>
            <li>Tempo Traveller (AC / Non AC)</li>
            <li>Mini Buses &amp; 50-Seater Buses</li>
          </ul>
        </div>
        <div>
          <div className="font-display text-xs font-bold uppercase tracking-wide text-white/60">
            Policies
          </div>
          <ul className="mt-3 space-y-1 text-sm text-white/85">
            <li><a className="hover:text-white" href="/terms">Terms &amp; Conditions</a></li>
            <li><a className="hover:text-white" href="/privacy">Privacy Policy</a></li>
            <li><a className="hover:text-white" href="/cancellation-policy">Cancellation &amp; Refunds</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="font-display text-xs font-bold uppercase tracking-wide text-white/60">
            Book a Taxi by Area
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2 text-sm text-white/80">
            {visibleAreas.map((area, i) => (
              <li key={`${area.name}-${i}`} className="after:mx-2 after:text-white/30 after:content-['|'] last:after:content-none">
                <a
                  href={areaHref(area)}
                  className="hover:text-white hover:underline"
                >
                  {area.name} {area.suffix}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setShowAllAreas((v) => !v)}
            aria-expanded={showAllAreas}
            className="mt-5 inline-flex items-center gap-1 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold hover:bg-white/25"
          >
            <span aria-hidden="true">{showAllAreas ? '−' : '+'}</span>
            {showAllAreas ? 'Show fewer areas' : `View all ${AREAS.length} areas we cover`}
          </button>
        </div>
      </div>

      <div className="border-t border-white/15 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Networking Tours &amp; Travels. All fares include GST. Payment collected after the ride.
        <br />
        Designed, Developed and Maintained by Sathya Enterprises
      </div>
    </footer>
  );
}