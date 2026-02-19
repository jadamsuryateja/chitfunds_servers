const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const News = require('./models/News');
const State = require('./models/State');
const District = require('./models/District');
const Category = require('./models/Category');
const Admin = require('./models/Admin');

dotenv.config();

const seedNewsPosts = async () => {
    try {
        await connectDB();
        console.log('DB Connected');

        // Fetch existing data
        const states = await State.find({ isActive: true }).limit(5);
        const categories = await Category.find({ isActive: true });
        const admin = await Admin.findOne();

        if (states.length < 5) {
            console.error('Need at least 5 active states. Found:', states.length);
            process.exit(1);
        }
        if (!admin) {
            console.error('No admin user found');
            process.exit(1);
        }

        // Fetch one district for each state
        const stateDistricts = [];
        for (const state of states) {
            const district = await District.findOne({ state: state._id, isActive: true });
            stateDistricts.push({ state, district });
        }

        const getCat = (name) => categories.find(c => c.name === name)?._id || categories[0]._id;

        const posts = [
            {
                title: 'Hyderabad Metro Rail Breaks Daily Ridership Record with 5 Lakh Commuters',
                description: 'The Hyderabad Metro Rail achieved a historic milestone on Tuesday by recording over five lakh passengers in a single day, surpassing its previous record.',
                content: `
                    <h2>Hyderabad Metro Achieves Record Ridership</h2>
                    <p>The Hyderabad Metro Rail Limited (HMRL) has achieved a remarkable milestone by recording over five lakh daily passengers for the first time since its inception. The achievement came on Tuesday when 5,02,347 commuters traveled across the three operational corridors of the metro system.</p>
                    <p>Managing Director NVS Reddy expressed his satisfaction at the achievement, noting that consistent improvements in frequency and the extension of operating hours had contributed significantly to the growth in ridership. "This is a proud moment for Hyderabad's public transportation system," he said in an official statement.</p>
                    <h3>Corridor-Wise Breakdown</h3>
                    <p>The Red Line (Miyapur to LB Nagar) carried the highest number of passengers at 2.1 lakh, followed by the Blue Line (Nagole to Raidurg) at 1.8 lakh. The Green Line (JBS to MGBS) recorded 1.02 lakh passengers.</p>
                    <p>Officials attributed the surge to the introduction of last-mile connectivity solutions, including electric feeder buses and integration with TSRTC bus routes. The metro authority has also partnered with ride-sharing apps to offer discounted rides to and from metro stations.</p>
                    <h3>Future Expansion</h3>
                    <p>The Telangana government has approved a second phase of expansion that will add 67 kilometers to the existing network. The new corridors will connect the airport, Old City, and several suburban areas, expected to be operational by 2029.</p>
                    <p>Transit experts say the metro has significantly reduced traffic congestion on major arterial roads. Studies by the Indian Institute of Technology Hyderabad show that commuters are saving an average of 45 minutes per trip compared to road travel during peak hours.</p>
                `,
                image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800',
                state: stateDistricts[0].state._id,
                district: stateDistricts[0].district?._id || null,
                category: getCat('National'),
                tags: ['metro', 'hyderabad', 'transportation', 'telangana'],
                status: 'published',
                isTopStory: true,
                isBanner: true,
                author: admin._id,
                publishedAt: new Date()
            },
            {
                title: 'Vizag Steel Plant Workers Launch Massive Rally Demanding Reversal of Privatization',
                description: 'Thousands of steel plant workers and their families marched through the streets of Visakhapatnam, demanding the central government withdraw its decision to privatize Rashtriya Ispat Nigam Limited.',
                content: `
                    <h2>Massive Rally Against Vizag Steel Plant Privatization</h2>
                    <p>In one of the largest demonstrations seen in the port city this year, more than fifty thousand workers, union members, and citizens took to the streets on Wednesday to protest the proposed privatization of Rashtriya Ispat Nigam Limited (RINL), commonly known as Vizag Steel Plant.</p>
                    <p>The rally, organized by a coalition of trade unions including CITU, AITUC, and INTUC, began at the steel plant gate and culminated at the GVMC Gandhi Statue junction. Participants held banners reading "Save Vizag Steel" and "Our Steel Plant, Our Pride" as they marched for nearly six kilometers.</p>
                    <h3>Workers Speak Out</h3>
                    <p>"This plant was built with the blood and sweat of Andhra Pradesh's people. For decades, we fought for its establishment, and now they want to hand it over to private corporations," said Srinivasa Rao, president of the steel plant workers' union.</p>
                    <p>Several retired workers, some in their eighties, joined the march despite the scorching heat. "I worked here for 35 years. This isn't just a factory—it's the lifeline of Visakhapatnam. Privatization will destroy lakhs of livelihoods," said K. Ramaiah, a retired chief operator.</p>
                    <h3>Political Support</h3>
                    <p>Leaders from multiple political parties, including TDP, YSRCP, and Jana Sena, expressed solidarity with the workers. Chief Minister Chandrababu Naidu reiterated his government's opposition to the privatization and pledged to send a resolution to the central government demanding the decision be reversed.</p>
                    <p>The central government had earlier approved the strategic disinvestment of RINL, but faced intense backlash from the state. The plant, which has an annual capacity of 7.3 million tonnes, employs over 17,000 permanent workers and supports nearly one lakh contract and ancillary jobs.</p>
                    <h3>Economic Impact</h3>
                    <p>Economic analysts warn that privatization could lead to massive job losses and devastate the local economy. "Vizag Steel contributes approximately ₹20,000 crore to Visakhapatnam's economy annually. Any disruption would have cascading effects on the entire north Andhra region," said Prof. K. Lakshmi of Andhra University's Economics Department.</p>
                `,
                image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800',
                state: stateDistricts[1].state._id,
                district: stateDistricts[1].district?._id || null,
                category: getCat('Politics'),
                tags: ['vizag', 'steel-plant', 'privatization', 'andhra-pradesh'],
                status: 'published',
                isTopStory: true,
                isTrending: true,
                author: admin._id,
                publishedAt: new Date()
            },
            {
                title: 'Bengaluru Launches India\'s First AI-Powered Traffic Management System Across 500 Junctions',
                description: 'Karnataka\'s capital becomes the first Indian city to deploy AI-based adaptive traffic signal control across 500 major intersections, promising to cut commute times by 30 percent.',
                content: `
                    <h2>AI-Powered Traffic Revolution in Bengaluru</h2>
                    <p>Bengaluru, India's technology capital, has taken a groundbreaking step toward solving its notorious traffic congestion by launching the country's first city-wide AI-powered adaptive traffic management system. The system, now operational across 500 major junctions, uses real-time data from cameras, sensors, and connected vehicles to dynamically adjust traffic signal timings.</p>
                    <p>Chief Minister Siddaramaiah inaugurated the system at the Bangalore Traffic Management Centre (BTMC) on Monday, calling it "a new era of urban mobility for Karnataka."</p>
                    <h3>How the System Works</h3>
                    <p>Unlike conventional fixed-timer signals, the AI system continuously analyzes traffic flow patterns, pedestrian movement, and emergency vehicle locations. It then adjusts green and red signal durations in real time, optimizing for minimum wait times across interconnected corridors.</p>
                    <p>"The AI models are trained on three years of Bengaluru traffic data. They can predict congestion patterns 15 minutes in advance and pre-emptively adjust signals," explained Dr. Meera Krishnan, chief technology officer of the project. "During monsoon or event days, the system automatically switches to specialized traffic plans."</p>
                    <h3>Initial Results</h3>
                    <p>During the three-month pilot phase covering 50 junctions along the Outer Ring Road, average commute times on the corridor dropped by 28 percent, and the number of traffic congestion incidents reduced by 42 percent. Fuel consumption for vehicles on the pilot route decreased by an estimated 15 percent.</p>
                    <p>The full deployment across 500 junctions was completed at a cost of ₹450 crore, funded jointly by the state government and the Smart Cities Mission. The system integrates with Google Maps and Apple Maps to provide real-time routing suggestions to commuters.</p>
                    <h3>Citizen Response</h3>
                    <p>"My daily commute from Whitefield to Electronic City used to take 90 minutes. This week, I've been reaching in about 55 minutes. The difference is remarkable," said Priya Sharma, a software engineer.</p>
                    <p>Bengaluru Traffic Police Commissioner Suresh Kumar noted that the system has also reduced traffic violation incidents by 35 percent through integrated ANPR (Automatic Number Plate Recognition) cameras.</p>
                `,
                image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
                state: stateDistricts[2].state._id,
                district: stateDistricts[2].district?._id || null,
                category: getCat('National'),
                tags: ['bengaluru', 'AI', 'traffic', 'technology', 'karnataka'],
                status: 'published',
                isTrending: true,
                author: admin._id,
                publishedAt: new Date()
            },
            {
                title: 'Chennai Super Kings Academy Inaugurates Massive Cricket Complex in Tambaram with 12 Pitches',
                description: 'The CSK Foundation, in partnership with the Tamil Nadu Cricket Association, has opened a state-of-the-art cricket training facility in Tambaram, aiming to nurture grassroots talent.',
                content: `
                    <h2>CSK Academy Opens World-Class Cricket Complex in Chennai</h2>
                    <p>In a major boost to grassroots cricket development in Tamil Nadu, the Chennai Super Kings (CSK) Foundation, in collaboration with the Tamil Nadu Cricket Association (TNCA), inaugurated a sprawling 25-acre cricket training complex in Tambaram on Saturday.</p>
                    <p>The facility features 12 turf wickets, six synthetic pitches, indoor practice nets, a fully equipped gymnasium, sports science laboratory, and digital performance analysis center. It also includes residential accommodation for up to 200 trainees.</p>
                    <h3>Vision for the Future</h3>
                    <p>Speaking at the inauguration, CSK captain MS Dhoni said, "Tamil Nadu has always produced exceptional cricketers. This academy aims to provide young talented individuals with the same world-class facilities that international players use. I believe the next generation of Indian cricket legends will come from places like this."</p>
                    <p>TNCA president Rupa Gurunath added that the academy would offer fully funded scholarships to talented youth from economically weaker backgrounds across all 38 districts of Tamil Nadu. "Cricket should not be a privilege. Talent knows no economic boundary," she said.</p>
                    <h3>Cutting-Edge Technology</h3>
                    <p>The academy incorporates advanced sports technology, including hawk-eye ball tracking, biomechanical analysis using motion capture cameras, and AI-powered bowling machines that can replicate the bowling styles of any international bowler.</p>
                    <p>"We have partnered with IIT Madras to develop custom sports analytics software. Each trainee will receive detailed performance reports with specific recommendations for improvement," explained academy director L. Sivaramakrishnan, the former India spinner.</p>
                    <h3>Community Impact</h3>
                    <p>The construction of the facility has already created over 500 permanent jobs in the area. Local businesses report a 40 percent increase in activity since construction began. The Tambaram Municipal Corporation has also upgraded roads and public transportation routes to improve access to the complex.</p>
                    <p>Registrations for the first intake of 100 trainees will begin next month, with selection trials scheduled across major cities in Tamil Nadu.</p>
                `,
                image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
                state: stateDistricts[3].state._id,
                district: stateDistricts[3].district?._id || null,
                category: getCat('Sports'),
                tags: ['CSK', 'cricket', 'chennai', 'sports', 'tamil-nadu'],
                status: 'published',
                isTopStory: true,
                author: admin._id,
                publishedAt: new Date()
            },
            {
                title: 'Maharashtra Government Announces ₹15,000 Crore Mumbai Coastal Road Extension to Virar',
                description: 'In a major infrastructure push, the Maharashtra government has sanctioned the northern extension of the Mumbai Coastal Road from Bandra to Virar, expected to transform commuting for millions.',
                content: `
                    <h2>Mumbai Coastal Road Extended to Virar — ₹15,000 Crore Project Approved</h2>
                    <p>The Maharashtra state cabinet on Thursday approved the ambitious northern extension of the Mumbai Coastal Road, stretching from the Bandra-Worli Sea Link to Virar—a distance of approximately 65 kilometers. The ₹15,000 crore project is expected to be completed in phases by 2030.</p>
                    <p>Chief Minister Eknath Shinde described the project as "a game-changer for Mumbai's western suburbs and the Vasai-Virar belt," noting that it would reduce travel time between South Mumbai and Virar from over three hours to just 50 minutes.</p>
                    <h3>Project Details</h3>
                    <p>The extension will be an eight-lane expressway running along the coast, with four interchanges connecting to the Western Express Highway. The project includes two undersea tunnels near Juhu and Gorai, a 2.5-kilometer bridge across the Vasai Creek, and dedicated cycling and pedestrian pathways along scenic coastal stretches.</p>
                    <p>"This is the most complex infrastructure project ever undertaken in Mumbai. The coastal alignment minimizes land acquisition issues while providing breathtaking views of the Arabian Sea," said Ashwini Bhide, additional municipal commissioner overseeing the project.</p>
                    <h3>Environmental Considerations</h3>
                    <p>Environmental groups had initially opposed the project, but the government has incorporated significant ecological safeguards. These include mangrove restoration covering 200 hectares along the route, underwater marine habitat protection measures, and a dedicated ₹500 crore environmental mitigation fund.</p>
                    <p>"After extensive consultations with marine biologists and environmental experts, we have redesigned several sections to avoid sensitive ecosystems. The project will actually result in a net positive for mangrove coverage in the region," explained the project's chief environmental officer, Dr. Neha Patil.</p>
                    <h3>Economic Transformation</h3>
                    <p>Real estate analysts project that property values along the Virar corridor could increase by 25-40 percent over the next five years. The improved connectivity is also expected to attract IT parks and commercial developments to the Vasai-Virar region, creating an estimated 2 lakh new jobs.</p>
                    <p>The first phase, from Bandra to Dahisar, is expected to be operational by 2027. Construction tenders will be issued next month.</p>
                `,
                image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
                state: stateDistricts[4].state._id,
                district: stateDistricts[4].district?._id || null,
                category: getCat('National'),
                tags: ['mumbai', 'coastal-road', 'infrastructure', 'maharashtra'],
                status: 'published',
                isBanner: true,
                isTrending: true,
                author: admin._id,
                publishedAt: new Date()
            }
        ];

        for (const post of posts) {
            const existing = await News.findOne({ title: post.title });
            if (existing) {
                console.log(`Already exists: ${post.title.substring(0, 50)}...`);
                continue;
            }
            const created = await News.create(post);
            const stateName = stateDistricts.find(sd => sd.state._id.equals(post.state))?.state.name || 'Unknown';
            const distName = stateDistricts.find(sd => sd.district?._id?.equals(post.district))?.district?.name || 'None';
            console.log(`✅ Created: "${created.title.substring(0, 50)}..." | State: ${stateName} | District: ${distName}`);
        }

        console.log('\n🎉 Seeding completed! 5 posts created.');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedNewsPosts();
