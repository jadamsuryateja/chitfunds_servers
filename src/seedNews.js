const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const News = require('./models/News');
const Category = require('./models/Category');
const State = require('./models/State');
const District = require('./models/District');

const seedNews = [
    // ═══ NATIONAL ═══
    {
        categoryName: 'National',
        articles: [
            {
                title: 'Union Budget 2026 Allocates Record ₹12 Lakh Crore for Infrastructure',
                description: 'Finance Minister announces massive infrastructure push with highways, railways, and smart city projects across the nation.',
                content: '<p>The Union Budget 2026 has announced a historic allocation of ₹12 lakh crore for infrastructure development, marking a 25% increase from the previous year. The Finance Minister highlighted that this investment will create over 50 lakh new jobs and boost GDP growth to 8.5%.</p><p>Key highlights include 25,000 km of new highways, expansion of metro networks in 15 cities, and development of 100 smart cities. The budget also proposes a new green infrastructure fund of ₹2 lakh crore for sustainable development projects.</p><p>Industry leaders have welcomed the move, calling it a transformative step for India\'s economic growth. The stock market responded positively with Sensex surging over 1,500 points on budget day.</p>',
                image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
                tags: ['budget', 'infrastructure', 'economy'],
                isTopStory: true,
                isTrending: true
            },
            {
                title: 'India Successfully Launches Chandrayaan-4 Mission to Moon',
                description: 'ISRO achieves another milestone with the successful launch of Chandrayaan-4 from Sriharikota.',
                content: '<p>India\'s space agency ISRO has successfully launched the Chandrayaan-4 mission from the Satish Dhawan Space Centre in Sriharikota. The mission aims to collect and return lunar soil samples, making India the fourth country to achieve this feat.</p><p>The GSLV Mark IV rocket carrying the spacecraft lifted off at 2:35 PM IST to thunderous applause from scientists and spectators. The mission is expected to reach the Moon in 40 days.</p><p>Prime Minister congratulated the ISRO team, calling it a proud moment for the nation. The mission carries advanced instruments for studying the lunar surface composition and searching for water ice in permanently shadowed craters.</p>',
                image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800',
                tags: ['ISRO', 'space', 'Chandrayaan'],
                isTopStory: true
            },
            {
                title: 'New Education Policy: 500 Universities to Adopt Multidisciplinary Curriculum',
                description: 'Ministry of Education announces rapid adoption of NEP across higher education institutions.',
                content: '<p>The Ministry of Education has announced that 500 universities across India will transition to the multidisciplinary curriculum model under the New Education Policy (NEP) by the end of 2026.</p><p>Students will now have the flexibility to choose subjects across disciplines, combining technology with humanities, and arts with sciences. The four-year undergraduate degree with multiple exit options will be implemented nationwide.</p><p>Education experts have praised the move, noting that it aligns India\'s education system with global best practices and will produce more well-rounded graduates.</p>',
                image: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800',
                tags: ['education', 'NEP', 'universities']
            },
            {
                title: 'Indian Railways Completes Bullet Train Testing on Mumbai-Ahmedabad Corridor',
                description: 'The high-speed rail project reaches a major milestone with successful test runs at 320 kmph.',
                content: '<p>Indian Railways has completed the first successful test run of the bullet train on the Mumbai-Ahmedabad corridor, with the train reaching speeds of 320 kmph during trials. The ₹1.08 lakh crore project is now on track for commercial operations by mid-2027.</p><p>The 508-km corridor will reduce travel time between the two cities from 7 hours to just 2 hours and 7 minutes. The project features 12 stations, including an underwater tunnel section crossing the Thane Creek.</p>',
                image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800',
                tags: ['railways', 'bullet-train', 'infrastructure']
            }
        ]
    },

    // ═══ WORLD ═══
    {
        categoryName: 'World',
        articles: [
            {
                title: 'G20 Summit Reaches Historic Climate Agreement in Rio de Janeiro',
                description: 'World leaders commit to 60% reduction in carbon emissions by 2040 with binding targets.',
                content: '<p>In a landmark decision, G20 leaders have reached a historic climate agreement at the Rio de Janeiro summit, committing to a 60% reduction in carbon emissions by 2040. The agreement includes binding targets for the first time, with penalties for non-compliance.</p><p>The deal also establishes a $500 billion green climate fund to help developing nations transition to renewable energy sources. India and China have signed the agreement after negotiations on differential targets based on development status.</p><p>Environmental groups have cautiously welcomed the agreement, calling it a step in the right direction while noting that implementation will be the real challenge.</p>',
                image: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f31?w=800',
                tags: ['G20', 'climate', 'global'],
                isTopStory: true,
                isTrending: true
            },
            {
                title: 'European Union Passes Comprehensive AI Regulation Framework',
                description: 'EU becomes the first major economy to implement binding rules on artificial intelligence.',
                content: '<p>The European Union has officially passed the world\'s most comprehensive AI regulation framework, establishing strict rules for high-risk AI applications including facial recognition, autonomous vehicles, and healthcare diagnostics.</p><p>The regulation categorizes AI systems into four risk levels and requires companies to conduct impact assessments before deploying high-risk systems. Violations could result in fines of up to 6% of global revenue.</p>',
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
                tags: ['EU', 'AI', 'technology', 'regulation']
            },
            {
                title: 'Japan Launches World\'s First Commercial Fusion Power Plant',
                description: 'The 500 MW facility in Osaka marks the beginning of a new era in clean energy.',
                content: '<p>Japan has made history by launching the world\'s first commercial fusion power plant in Osaka, producing 500 MW of clean electricity. The facility uses advanced tokamak technology and superconducting magnets to sustain fusion reactions.</p><p>The breakthrough promises virtually unlimited clean energy with no carbon emissions and minimal radioactive waste. Several countries including India, the US, and China have signed cooperation agreements to develop similar facilities.</p>',
                image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
                tags: ['Japan', 'fusion', 'energy', 'technology']
            },
            {
                title: 'United Nations Reports Record-Breaking Renewable Energy Adoption Globally',
                description: 'Solar and wind power now account for 45% of global electricity generation.',
                content: '<p>The United Nations has released its annual energy report showing that renewable energy sources now account for 45% of global electricity generation, up from 30% just three years ago. Solar power alone has seen a 200% increase in installed capacity.</p><p>India ranks third globally in renewable energy capacity, with over 250 GW of installed solar and wind power. The report projects that renewables will surpass fossil fuels as the primary energy source by 2030.</p>',
                image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
                tags: ['UN', 'renewable', 'solar', 'energy']
            }
        ]
    },

    // ═══ CRIME ═══
    {
        categoryName: 'Crime',
        articles: [
            {
                title: 'Cyber Crime Cell Busts Major Online Fraud Network Operating Across 5 States',
                description: 'Police arrest 32 suspects involved in ₹500 crore digital payment scam targeting senior citizens.',
                content: '<p>In a major breakthrough, the Cyber Crime Cell has dismantled a sophisticated online fraud network that was operating across five states, defrauding citizens of over ₹500 crore through fake banking apps and phishing schemes.</p><p>The operation, codenamed "Digital Shield," resulted in the arrest of 32 suspects including the mastermind, a 28-year-old engineering graduate. Police recovered 150 mobile phones, 45 laptops, and froze bank accounts containing ₹85 crore.</p><p>The gang primarily targeted senior citizens through fake customer care numbers and fraudulent UPI payment links. Police have urged citizens to verify all banking communications directly with their banks.</p>',
                image: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800',
                tags: ['cyber-crime', 'fraud', 'police'],
                isTopStory: true,
                isTrending: true
            },
            {
                title: 'Police Recover Stolen Ancient Artifacts Worth ₹200 Crore from International Smuggling Ring',
                description: 'Joint operation with Interpol leads to recovery of 150 priceless artifacts from the Chola dynasty.',
                content: '<p>In an unprecedented international operation, Indian police in coordination with Interpol have recovered 150 stolen ancient artifacts worth an estimated ₹200 crore from an international smuggling ring. The artifacts include bronze sculptures, stone carvings, and gold ornaments from the Chola dynasty.</p><p>The operation spanned three countries and resulted in 18 arrests. The artifacts were being transported through a complex network of shell companies and private collectors.</p>',
                image: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800',
                tags: ['artifacts', 'smuggling', 'Interpol']
            },
            {
                title: 'Anti-Narcotics Squad Seizes ₹1,000 Crore Drug Shipment at Mumbai Port',
                description: 'Record seizure includes 500 kg of synthetic drugs hidden in industrial chemical containers.',
                content: '<p>The Anti-Narcotics Squad has made the largest drug seizure in Indian history, intercepting a shipment worth ₹1,000 crore at Mumbai\'s Jawaharlal Nehru Port. The 500 kg consignment of synthetic drugs was cleverly concealed in containers labeled as industrial chemicals.</p><p>Six suspects have been arrested, including two foreign nationals. The investigation has revealed links to an international drug cartel operating from Southeast Asia.</p>',
                image: 'https://images.unsplash.com/photo-1453873531674-2151bcd01707?w=800',
                tags: ['drugs', 'narcotics', 'Mumbai']
            },
            {
                title: 'CBI Files Chargesheet in Multi-Crore Bank Loan Fraud Case',
                description: 'Investigation reveals systematic manipulation of loan documents by a network of bank officials.',
                content: '<p>The Central Bureau of Investigation has filed a comprehensive chargesheet in the ₹3,500 crore bank loan fraud case, naming 14 accused including senior bank officials, corporate executives, and chartered accountants.</p><p>The investigation revealed a systematic scheme of creating fake companies, forging property documents, and manipulating credit ratings to secure massive loans that were then siphoned off through shell companies.</p>',
                image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
                tags: ['CBI', 'bank-fraud', 'investigation']
            }
        ]
    },

    // ═══ VILLAGE NEWS ═══
    {
        categoryName: 'Village News',
        articles: [
            {
                title: 'Remote Village in Jharkhand Becomes India\'s First Fully Solar-Powered Gram Panchayat',
                description: 'Mahuadanr village achieves 100% renewable energy independence with community-owned solar farm.',
                content: '<p>The remote village of Mahuadanr in Jharkhand has become India\'s first gram panchayat to achieve complete solar energy independence. The community-owned 500 kW solar farm now powers all households, schools, and the primary health centre.</p><p>The project was funded through a combination of government subsidies and community contributions. Villagers now save an average of ₹2,000 per month on electricity bills, and the surplus power is sold to the grid, generating income for the panchayat.</p><p>The model is being studied by other states for replication in rural areas still dependent on diesel generators.</p>',
                image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
                tags: ['solar', 'village', 'renewable'],
                isTopStory: true
            },
            {
                title: 'Women Self-Help Group in Odisha Builds ₹5 Crore Organic Farming Enterprise',
                description: '200 women transform barren land into thriving organic farm, now exporting to 3 countries.',
                content: '<p>A remarkable success story is unfolding in rural Odisha where a women\'s self-help group of 200 members has built a ₹5 crore organic farming enterprise from scratch. Starting with just 2 acres of barren land five years ago, the group now cultivates 500 acres of certified organic produce.</p><p>Their products, including turmeric, ginger, and millets, are now exported to Japan, Germany, and the UAE. The enterprise has provided sustainable livelihoods for 500 families in surrounding villages.</p>',
                image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
                tags: ['women', 'organic', 'farming', 'Odisha']
            },
            {
                title: 'Tribal Community in Kerala Develops Innovative Rainwater Harvesting System',
                description: 'Indigenous engineering techniques combined with modern materials create a low-cost water solution.',
                content: '<p>A tribal community in Kerala\'s Wayanad district has developed an innovative rainwater harvesting system that combines indigenous engineering knowledge with modern materials. The low-cost system can store up to 50,000 litres of water per household.</p><p>The system uses natural filtration through layers of sand, gravel, and activated charcoal, producing water that meets WHO drinking standards. The innovation has been recognized by the National Innovation Foundation.</p>',
                image: 'https://images.unsplash.com/photo-1468421870903-4df1664ac249?w=800',
                tags: ['water', 'tribal', 'Kerala', 'innovation']
            },
            {
                title: 'Young Engineer Returns to Village, Sets Up Free Digital Literacy Centre',
                description: 'IIT graduate trains 2,000 rural youth in computer skills and digital tools in Rajasthan village.',
                content: '<p>A 27-year-old IIT graduate has returned to his native village in Rajasthan\'s Barmer district to set up a free digital literacy centre. In just 18 months, the centre has trained over 2,000 rural youth in basic computer skills, digital payments, and online government services.</p><p>The centre operates from a renovated community hall and is equipped with 30 computers donated by tech companies. Several trainees have secured jobs in nearby towns, and some have started their own small online businesses.</p>',
                image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800',
                tags: ['education', 'digital', 'rural', 'Rajasthan']
            }
        ]
    },

    // ═══ SPORTS ═══
    {
        categoryName: 'Sports',
        articles: [
            {
                title: 'India Clinches Historic Cricket World Cup Victory with Unbeaten Run',
                description: 'Team India defeats Australia by 8 wickets in a dominant final at the Narendra Modi Stadium.',
                content: '<p>India has won the Cricket World Cup with a commanding 8-wicket victory over Australia in the final at the Narendra Modi Stadium in Ahmedabad. The team remained unbeaten throughout the tournament, winning all 11 matches.</p><p>Chasing 241, India reached the target in just 42 overs with the captain scoring a masterful century. The bowling attack restricted Australia to 240 all out, with the pace duo sharing 7 wickets between them.</p><p>Millions of fans across the country celebrated through the night, with victory parades planned in Mumbai and Delhi. The Prime Minister congratulated the team, calling it a moment of national pride.</p>',
                image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
                tags: ['cricket', 'world-cup', 'India'],
                isTopStory: true,
                isTrending: true
            },
            {
                title: 'Indian Athletes Win Record 15 Medals at Asian Games 2026',
                description: 'Track and field events contribute 6 gold medals as India finishes third in medal tally.',
                content: '<p>India has achieved its best-ever performance at the Asian Games 2026, winning a record 15 medals including 6 gold, 5 silver, and 4 bronze. The athletics team was the star performer, contributing 6 gold medals across sprint, javelin, and relay events.</p><p>Neeraj Chopra added another gold to his collection with a throw of 92.5 meters, while the women\'s 4x400m relay team set a new Asian record. India finished third in the overall medal tally behind China and Japan.</p>',
                image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8bf8bd?w=800',
                tags: ['Asian-Games', 'medals', 'athletics']
            },
            {
                title: 'Premier League: Mumbai City FC Becomes First Indian Club to Qualify for AFC Champions League Final',
                description: 'Historic achievement for Indian football as Mumbai City FC defeats Al-Hilal in semi-final.',
                content: '<p>Mumbai City FC has made history by becoming the first Indian club to qualify for the AFC Champions League final after defeating Saudi Arabia\'s Al-Hilal 3-2 on aggregate in a thrilling semi-final.</p><p>The decisive away goal came in the 88th minute, sending the travelling Indian fans into euphoria. The club will face Yokohama F. Marinos of Japan in the final.</p>',
                image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
                tags: ['football', 'ISL', 'AFC', 'Mumbai']
            },
            {
                title: 'PV Sindhu Announces Retirement After Brilliant 15-Year Career',
                description: 'Double Olympic medalist bids farewell to badminton with an emotional ceremony in Hyderabad.',
                content: '<p>Badminton legend PV Sindhu has announced her retirement from professional badminton after a glittering 15-year career. The double Olympic medalist and World Champion made the announcement at an emotional ceremony in her hometown of Hyderabad.</p><p>Sindhu\'s career highlights include two Olympic medals (silver in 2016, bronze in 2020), a World Championship gold, and numerous Super Series titles. She is widely regarded as one of the greatest badminton players India has ever produced.</p>',
                image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
                tags: ['badminton', 'Sindhu', 'retirement', 'Hyderabad']
            }
        ]
    },

    // ═══ POLITICS ═══
    {
        categoryName: 'Politics',
        articles: [
            {
                title: 'Parliament Passes Landmark Women\'s Reservation Bill with Overwhelming Majority',
                description: '33% reservation for women in Lok Sabha and State Assemblies to be implemented from next election.',
                content: '<p>In a historic session, Parliament has passed the Women\'s Reservation Bill with an overwhelming majority, guaranteeing 33% reservation for women in the Lok Sabha and all State Legislative Assemblies. The bill was passed with 454 votes in favor and only 2 against.</p><p>The legislation includes provisions for reservation within reserved seats for SC and ST communities. Political leaders across party lines hailed the passage as a watershed moment for Indian democracy.</p><p>The reservation will be implemented starting from the next general elections, expected to significantly increase women\'s representation in Indian politics. Currently, women hold only 15% of seats in the Lok Sabha.</p>',
                image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800',
                tags: ['parliament', 'women', 'reservation', 'bill'],
                isTopStory: true,
                isTrending: true
            },
            {
                title: 'Five States Announce Simultaneous Local Body Elections Under New Framework',
                description: 'Maharashtra, Tamil Nadu, Karnataka, Gujarat, and Rajasthan to hold panchayat elections together.',
                content: '<p>In a significant political development, five major states have announced they will hold local body elections simultaneously under a new collaborative framework. Maharashtra, Tamil Nadu, Karnataka, Gujarat, and Rajasthan will conduct panchayat and municipal elections on the same dates.</p><p>The move is seen as a precursor to the proposed "One Nation, One Election" policy. Election commissions of all five states have agreed on common security protocols and electronic voting procedures.</p>',
                image: 'https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=800',
                tags: ['elections', 'states', 'panchayat']
            },
            {
                title: 'Government Launches ₹50,000 Crore Rural Employment Guarantee Expansion',
                description: 'MGNREGA gets biggest boost with increased wages, new skill development component.',
                content: '<p>The government has announced a ₹50,000 crore expansion of the MGNREGA rural employment guarantee scheme, including a 25% increase in daily wages and a new skill development component. The enhanced program aims to provide 200 days of guaranteed employment per household.</p><p>The expansion also includes provisions for climate-resilient infrastructure projects such as water conservation structures, solar panel installation, and organic farming initiatives.</p>',
                image: 'https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?w=800',
                tags: ['MGNREGA', 'rural', 'employment', 'policy']
            },
            {
                title: 'Opposition Alliance Announces Joint Action Plan for Agricultural Reforms',
                description: '12 opposition parties unite to demand minimum support price guarantee for farmers.',
                content: '<p>A coalition of 12 opposition parties has announced a joint action plan demanding comprehensive agricultural reforms, including a legal guarantee for minimum support prices (MSP) for all major crops. The alliance plans nationwide protests and parliamentary disruptions to push for the legislation.</p><p>The action plan also includes demands for crop insurance reforms, irrigation infrastructure expansion, and establishment of cold chain networks in rural areas. Farmer unions have extended their support to the initiative.</p>',
                image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
                tags: ['opposition', 'agriculture', 'MSP', 'farmers']
            }
        ]
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');

        // Ensure categories exist
        const categoryMap = {};
        for (const group of seedNews) {
            let cat = await Category.findOne({ name: group.categoryName });
            if (!cat) {
                cat = await Category.create({ name: group.categoryName, isActive: true });
                console.log(`📁 Created category: ${group.categoryName}`);
            }
            categoryMap[group.categoryName] = cat._id;
        }

        // Get a state for state-linked articles (optional)
        const states = await State.find({}).lean();

        let totalCreated = 0;

        for (const group of seedNews) {
            const catId = categoryMap[group.categoryName];

            for (const article of group.articles) {
                // Check if article already exists
                const existing = await News.findOne({ title: article.title });
                if (existing) {
                    console.log(`⏭️  Skipped (exists): ${article.title.substring(0, 50)}...`);
                    continue;
                }

                // Assign a random state to some articles
                let stateId = null;
                let districtId = null;
                if (states.length > 0 && Math.random() > 0.3) {
                    const randomState = states[Math.floor(Math.random() * states.length)];
                    stateId = randomState._id;

                    // Try to find a district for this state
                    const districts = await District.find({ state: stateId, isActive: true }).lean();
                    if (districts.length > 0) {
                        districtId = districts[Math.floor(Math.random() * districts.length)]._id;
                    }
                }

                const newsDoc = new News({
                    title: article.title,
                    description: article.description,
                    content: article.content,
                    image: article.image,
                    category: catId,
                    state: stateId,
                    district: districtId,
                    tags: article.tags || [],
                    status: 'published',
                    isTopStory: article.isTopStory || false,
                    isTrending: article.isTrending || false,
                    isBanner: article.isBanner || false,
                    publishedAt: new Date(),
                    views: Math.floor(Math.random() * 5000)
                });

                await newsDoc.save();
                totalCreated++;
                console.log(`✅ Created: [${group.categoryName}] ${article.title.substring(0, 60)}...`);
            }
        }

        console.log(`\n🎉 Seeding complete! ${totalCreated} articles created across ${Object.keys(categoryMap).length} categories.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
}

seed();
