import { GalleryItem } from "./types";

export const GALLERY_CATEGORIES = [
  "All",
  "Cinematic Portrait",
  "CGI Portrait",
  "VFX Portrait"
];

export const MOCK_GALLERY_ITEMS: GalleryItem[] = [
  // ==================== CINEMATIC PORTRAIT SERIES (12 Items) ====================
  {
    id: "g_1",
    title: "Stadium Champion Spotlight",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "Create a masterpiece close-up movie-staged sport cinematic portrait of [YOUR FACE] posing under intense gold and royal-blue stadium floodlights. The model stands tall with determination. The background features huge, out-of-focus crowd formations under dark evening shadows, swirling volumetric smoke, and golden confetti glitter elements drifting through the atmosphere. Soft, premium chiaroscuro shadows define the facial structure. Captured with a custom anamorphic 85mm lens at f/1.2, rich film grain, high contrast studio color grading, beautiful lens flare streaks. Perfect for dynamic face-swapping.",
    category: "Cinematic Portrait",
    aspectRatio: "portrait",
    tags: ["Sports", "Stadium", "Anamorphic", "Chiaroscuro"],
    author: "Saul Goodman"
  },
  {
    id: "g_2",
    title: "Synth-Noir Detective",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A moody, cinematic synth-noir close-up portrait of [YOUR FACE] posing in a smoke-filled private investigator's office. High-contrast neon window-blind shadows cross beautifully over the face, casting dramatic vertical lines of purple and amber light across the model's skin. The subject wears a tailored charcoal wool trench coat with a high raised collar. Swirling cigarette smoke trails are backlit by the external rainy neon skyline window. Captured on authentic 35mm film grain, Blade Runner aesthetic, moody, shallow depth of field, rich textures.",
    category: "Cinematic Portrait",
    aspectRatio: "portrait",
    tags: ["Noir", "Neon", "Smoke", "Blade Runner"],
    author: "Studio"
  },
  {
    id: "g_3",
    title: "Golden Hour Celestial",
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A high-fashion fine art cinematic masterpiece of [YOUR FACE] backlit by gorgeous, rich sunset lighting. Celestial sun rays slice through a dusty minimalist gallery room, casting romantic side-lit shadows across the face and highlighting skin textures perfectly. Dark, warm earthly tones dominate the backdrop, decorated with floating light dust motes and gold luxury fabric draping around the shoulders. Award-winning beauty illumination, f/1.4 lens, elegant composition, deeply emotional gaze.",
    category: "Cinematic Portrait",
    aspectRatio: "portrait",
    tags: ["Sunset", "Celestial", "Shadows", "Elegant"],
    author: "Studio"
  },
  {
    id: "g_4",
    title: "Steampunk Explorer",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "An exquisite Victorian steampunk explorer cinematic portrait of [YOUR FACE]. The subject is wearing dark-leather aviator goggles resting on the forehead, paired with a custom high-collar passenger vest and brass gear buckles. The background is a nostalgic, golden-toned airship cockpit filled with massive interlocking clockwork gears, copper pipes emitting tiny steam puffs, and warm amber light streams pouring through a round bay window. Extremely rich ambient occlusion, highly detailed retro aesthetic.",
    category: "Cinematic Portrait",
    aspectRatio: "portrait",
    tags: ["Steampunk", "Retro", "Leather", "Goggles"],
    author: "Studio"
  },
  {
    id: "g_5",
    title: "Studio Sunset Profile",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A professional, award-winning cinematic studio portrait of [YOUR FACE] captured in a quarter-turn profile. Outstanding rim lighting from a bright sunset simulator outlines the model's hair strands and facial features. The backdrop is a clean, dark twilight blue canvas with a subtle, warm orange gradient light flare in the lower quadrant. Extremely realistic skin pore textures, gorgeous soft focus background roll-off, standard 85mm portrait camera setup.",
    category: "Cinematic Portrait",
    aspectRatio: "portrait",
    tags: ["Studio", "Orange Glow", "Profile", "Clean"],
    author: "Studio"
  },
  {
    id: "g_6",
    title: "Lost Horizon Rebel",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "An intense, cinematic post-apocalyptic survivor portrait of [YOUR FACE] looking directly into the camera. Wind-blown hair, subtle dust and sand smudges on the cheekbones, representing a traveler of the desert ruins. In the background, a massive ancient structure is silhouetted against a brilliant purple and orange post-nuclear sunset. Warm key light on the face, cold indigo fill light on the shadows, dramatic, cinematic depth.",
    category: "Cinematic Portrait",
    aspectRatio: "portrait",
    tags: ["Desert", "Survivor", "Sunset", "Apocalypse"],
    author: "Studio"
  },
  {
    id: "g_7",
    title: "Dappled Forest Light",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A heartwarming cinematic portrait of [YOUR FACE] smiling softly while surrounded by a mystical forest. Beautiful dappled golden sunlight filters through massive oak canopies, casting abstract, organic leaf shadows along the model's face and shoulders. Swirling green and amber forest dust glows in the bright backlight. Natural earthy tones, shallow depth of field, highly peaceful aesthetic, photorealistic.",
    category: "Cinematic Portrait",
    aspectRatio: "portrait",
    tags: ["Forest", "Nature", "Sunlight", "Dappled"],
    author: "Studio"
  },
  {
    id: "g_8",
    title: "Cyber-Street Runner",
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A street-level cinematic portrait of [YOUR FACE] walking through a bustling cyber-metropolis. Saturated neon reflections of billboard ads glow on the model's leather jacket. Out-of-focus background crowds move through wet, rainy streets reflecting brilliant cyan, yellow, and magenta hues. Sharp foreground focus on the face, wet micro-droplets on skin, cinematic realism, movie shot.",
    category: "Cinematic Portrait",
    aspectRatio: "portrait",
    tags: ["Cyberpunk", "Street", "Rain", "Neon Night"],
    author: "Studio"
  },
  {
    id: "g_9",
    title: "Royal Crimson Elegance",
    imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A high-fashion dramatic cinematic portrait of [YOUR FACE] styled in royal, rich crimson garments. The subject is backlit by premium, intense white strobe lights creating high contrast shadows. Elegant velvet fabrics flow gracefully in the bottom half of the frame. The background is completely dark, creating a beautiful chiaroscuro focus entirely on the model's striking facial features. Unreal cinematic texture.",
    category: "Cinematic Portrait",
    aspectRatio: "portrait",
    tags: ["Fashion", "Crimson", "Chiaroscuro", "Studio"],
    author: "Studio"
  },
  {
    id: "g_10",
    title: "Moody Shadow play",
    imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A highly artistic, dramatic cinematic portrait of [YOUR FACE] featuring creative studio shadow play. Blinds or geometric meshes cast gorgeous, dark graphic strip lines across the model's eyes and face. Deep, warm monochromatic color palette. Incredibly sharp focus on the visible eye, rich analog film grain, cinematic commercial editorial style, optimized for realistic styling.",
    category: "Cinematic Portrait",
    aspectRatio: "portrait",
    tags: ["Shadow", "Monochrome", "Line-Art", "Editorial"],
    author: "Studio"
  },
  {
    id: "g_11",
    title: "Sovereign Mountain Peak",
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A majestic, rugged cinematic portrait of [YOUR FACE] standing at the peak of a snowy, misty mountain. The model looks off into the distance with a strong expression. Powerful wind blows thin snow particles across the frame. Golden morning light hits the side of the face, casting long, epic shadows. The background features huge, out-of-focus jagged snow peaks and swirling fog. Extreme high definition.",
    category: "Cinematic Portrait",
    aspectRatio: "portrait",
    tags: ["Mist", "Mountain", "Snow", "Adventure"],
    author: "Studio"
  },
  {
    id: "g_12",
    title: "Retro Arcade Nostalgia",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A nostalgic cinematic photo of [YOUR FACE] inside an 80s amusement arcade. Glowing colorful display screens representing pixels, neon blues and warm reds reflect beautifully off the model's cheeks and eyes. Dynamic depth of field, retro vintage analog camera aesthetic, light leak streaks in corners, extremely rich details.",
    category: "Cinematic Portrait",
    aspectRatio: "portrait",
    tags: ["Arcade", "Nostalgia", "80s", "Light Leak"],
    author: "Studio"
  },

  // ==================== CGI PORTRAIT SERIES (12 Items) ====================
  {
    id: "g_13",
    title: "Hydro-Splash Bubbles",
    imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A stunning computer-generated CGI portrait of [YOUR FACE] laughing joyfully. A highly detailed, realistic splash of sparkling turquoise water wraps around the neck and chin, with water droplets freeze-framed in mid-air in slow motion. Dozens of glowing, iridescent soap bubbles float around the face, refracting pastel rainbow light. Summer pool background, highly detailed refraction fluid simulations, 3D Octane Render style.",
    category: "CGI Portrait",
    aspectRatio: "portrait",
    tags: ["Water", "Splash", "Bubbles", "Octane Render"],
    author: "Studio"
  },
  {
    id: "g_14",
    title: "Liquid Rose-Gold Aura",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A breathtaking luxury CGI art portrait of [YOUR FACE] with high-viscosity liquid rose-gold metallic paint splashing and wrapping around the neck and shoulders in organic, waving flows. Swirling micro-gold dust clusters float in the dark studio air. Sharp spotlights create crisp reflections on the liquid metal. Flawless skin textures, highly polished CGI rendering style, premium materials.",
    category: "CGI Portrait",
    aspectRatio: "portrait",
    tags: ["Gold", "Liquid", "Luxury", "3D CGI"],
    author: "Studio"
  },
  {
    id: "g_15",
    title: "Ethereal Crystal Sovereign",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "An enchanting, high-fantasy ethereal CGI portrait of [YOUR FACE] as a magical Crystal Monarch. The head is adorned with an intricate, glowing crown made of raw luminous quartz and sapphire crystal shards, refracting rays of iridescent light. Glittering diamond dust is scattered over the cheekbones like sparkles, with white-gold mystical markings. Floating crystal shards fill the background cathedral hall, macro focus depth of field.",
    category: "CGI Portrait",
    aspectRatio: "portrait",
    tags: ["Crystals", "Fantasy", "Crown", "Glow"],
    author: "Studio"
  },
  {
    id: "g_16",
    title: "Abstract Paint Splash",
    imageUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A high-concept creative CGI portrait of [YOUR FACE] merged with dynamic, exploding splatters of organic watercolor paint in neon pink, cyan, and yellow. Bold paint streams trace around the facial contours, blending seamlessly with the model's skin. The background is a clean white studio with minor artistic paint dripping. A stunning mix of photorealistic human features and stylized CGI liquid physics, masterwork.",
    category: "CGI Portrait",
    aspectRatio: "portrait",
    tags: ["Color", "Paint", "Liquid Splat", "Artistic"],
    author: "Studio"
  },
  {
    id: "g_17",
    title: "Undersea SirenSong",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "An undersea CGI portrait of [YOUR FACE] singing. Floating crystalline bubbles of glass reflect the deep turquoise currents of the digital coral reef in the background. Glowing bioluminescent jellyfishes drift around the model's flowing, wave-like hair. Intricate underwater makeup with pearlescent scales decorated on the cheekbones, soft-focus CGI environment, dreamy volumetric rays.",
    category: "CGI Portrait",
    aspectRatio: "portrait",
    tags: ["Siren", "Underwater", "Jellyfish", "Scales"],
    author: "Studio"
  },
  {
    id: "g_18",
    title: "Liquid Chrome Liquid-Armor",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A futuristic sci-fi CGI portrait of [YOUR FACE] draped in liquid chrome mercury paint splashing across the chest and shoulders. The chrome acts like a mirror, reflecting a high-tech sci-fi server room and red laser guides. Highly polished metal textures, sleek organic flow shapes, dramatic neon studio lightning, CGI reflections, Unreal Engine 5 render feel.",
    category: "CGI Portrait",
    aspectRatio: "portrait",
    tags: ["Chrome", "Metal", "Liquid Armor", "Reflections"],
    author: "Studio"
  },
  {
    id: "g_19",
    title: "Bioluminescent Forest Princess",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "An ethereal Ghibli-inspired CGI fantasy portrait of [YOUR FACE] with cute, pointed elf ears. The model is crowned with glowing, bioluminescent green moss and flower sprouts. In the background forest, magical miniature sprites float around, carrying small warm orbs of yellow light that cast a soft glow on the face. Detailed 3D moss hair assets, fairy garden look, hyper-detailed rendering.",
    category: "CGI Portrait",
    aspectRatio: "portrait",
    tags: ["Elf", "Moss", "Sprout", "Magical Garden"],
    author: "Studio"
  },
  {
    id: "g_20",
    title: "Glassmorphism Butterfly Mask",
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A premium luxury CGI fashion portrait of [YOUR FACE] wearing a transparent, frosted glassmorphism butterfly mask. Rainbow refraction rays pass through the butterfly wings onto the cheeks and eyes, showing complex internal glass thickness. Dark, moody studio background, crisp highlight reflections, perfect beauty skin and glass physics rendering.",
    category: "CGI Portrait",
    aspectRatio: "portrait",
    tags: ["Glassmorphism", "Mask", "Refraction", "High-Fashion"],
    author: "Studio"
  },
  {
    id: "g_21",
    title: "Cosmic Nebula Dust",
    imageUrl: "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A captivating CGI portrait of [YOUR FACE] surrounded by swirling, colorful cosmic gas clouds in neon purple, red, and blue. Tiny glowing stardust particles cling to the model's hair and neck, glowing in the space atmosphere. The background is a vast deep-space arena with distant stars, creating a stunning sci-fi beauty look. High dynamic range, volumetric lighting.",
    category: "CGI Portrait",
    aspectRatio: "portrait",
    tags: ["Space", "Nebula", "Stardust", "Glow Paint"],
    author: "Studio"
  },
  {
    id: "g_22",
    title: "Digital Art Flame Crown",
    imageUrl: "https://images.unsplash.com/photo-1510520434124-5bc7e642410d?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "An epic high-fantasy CGI portrait of [YOUR FACE] wearing a crown made of living golden and scarlet flames. The fire casts an intense, realistic warm light and orange sparks across the shoulders and face, highlighting skin details with realistic heat distortion ripples. Dark cinder and ash air particles float in the heavy, moody atmosphere, cinematic CGI.",
    category: "CGI Portrait",
    aspectRatio: "portrait",
    tags: ["Fire", "Flame", "Crown", "Sparks"],
    author: "Studio"
  },
  {
    id: "g_23",
    title: "Silver Mercury Drops",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "An artistic CGI studio portrait of [YOUR FACE] with high-viscosity droplets of silver mercury dripping down from the hairline across the forehead, refracting studio light. Creative multi-color projections paint the model's face in magenta and blue gradients. Deep black backlights, hyper-reflective CGI materials, stunning design layout.",
    category: "CGI Portrait",
    aspectRatio: "portrait",
    tags: ["Mercury", "Drips", "Projections", "Creative"],
    author: "Studio"
  },
  {
    id: "g_24",
    title: "Ink Wash Splash Samurai",
    imageUrl: "https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "An incredible hybrid portrait of [YOUR FACE] as a digital samurai, where half of the image dissolves into traditional hand-drawn Japanese black ink wash brush strokes and watercolor paint splashes. Crisply modeled 3D armor details blend seamlessly with the flying artistic ink drips. Dramatic high-contrast shadows, highly creative CGI art style.",
    category: "CGI Portrait",
    aspectRatio: "portrait",
    tags: ["Ink Wash", "Samurai", "Traditional Mix", "Artist"],
    author: "Studio"
  },

  // ==================== VFX PORTRAIT SERIES (12 Items) ====================
  {
    id: "g_25",
    title: "Cyberpunk Rebel Core",
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A vibrant, hyper-stylized VFX portrait of [YOUR FACE] as an urban cyberpunk rebel. The background is a chaotic dark alley covered in glowing pink and lime-green graffiti spray paint. Graphic cybernetic micro-circuitry lines trace beautiful glowing blue lines along the model's cheekbones. The subject wears modern techwear, detailed collar, and neon headphones. Soft-focus particles floating in the foreground, Unreal Engine 5 render.",
    category: "VFX Portrait",
    aspectRatio: "portrait",
    tags: ["Cyberpunk", "VFX Cyber", "Circuitry", "Neon Glow"],
    author: "Studio"
  },
  {
    id: "g_26",
    title: "Holographic DJ Turntable",
    imageUrl: "https://images.unsplash.com/photo-1614680376593-902f74fa0d41?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "An action VFX portrait of [YOUR FACE] posing behind futuristic glowing holographic turntables. Swirling neon-violet and aqua sound wave frequencies wrap around the neck like concentric glowing light rings. Neon-lit music meters flicker in the blurred foreground. The background is a packed cyber rave under heavy laser beam lights. Highly energetic sci-fi visual effects.",
    category: "VFX Portrait",
    aspectRatio: "portrait",
    tags: ["DJ", "Hologram", "Sound waves", "Rave"],
    author: "Studio"
  },
  {
    id: "g_27",
    title: "Astral Void Astronaut",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "An immersive, stunning VFX close-up cosmic shot of [YOUR FACE] in a NASA-style astronaut suit. The flawless glass visor of the helmet reflects a cosmic explosion, showing swirling orange, purple, and green nebulas. Inside the helmet, tiny glowing interface HUD bars cast an elegant cool-blue ambient illumination across the face. Highly detailed texture suit fabric, cosmic rays.",
    category: "VFX Portrait",
    aspectRatio: "portrait",
    tags: ["Astronaut", "Visor Reflection", "HUD", "Nebula"],
    author: "Studio"
  },
  {
    id: "g_28",
    title: "Neon Angelic Wings",
    imageUrl: "https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "An epic, highly cinematic cyber-angel VFX portrait of [YOUR FACE]. Large high-voltage neon-indigo and electric-purple cybernetic wings extend from the shoulders, made of glowing visual energy beam threads and mechanical joints. The background is a dark cyberspace network with vertical matrix codes and glowing volumetric particles falling. Global illumination render.",
    category: "VFX Portrait",
    aspectRatio: "portrait",
    tags: ["Neon Wings", "Angel", "Cyberspace", "Beam Gears"],
    author: "Studio"
  },
  {
    id: "g_29",
    title: "Thunderbolt Storm Guard",
    imageUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A powerful, action VFX portrait of [YOUR FACE] as a storm god. Crackling blue and white lightning bolts wrap around the shoulders and chestpiece, sparking hot digital fire embers. The eyes are glowing with pure electric energy. Deep, dark rain clouds fill the background under a raging thunderstorm. Epic high key lighting, incredible motion, high shutter speed.",
    category: "VFX Portrait",
    aspectRatio: "portrait",
    tags: ["Lightning", "Storm God", "Electric Runes", "Action"],
    author: "Studio"
  },
  {
    id: "g_30",
    title: "Cyber Visor AR Matrix",
    imageUrl: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=85&w=800",
    generationPrompt: "An close-up sci-fi VFX portrait of [YOUR FACE] wearing high-tech augmented reality glasses. The visor displays a complex, glowing orange matrix interface, target vectors, and terminal code streams which are gorgeously projected and refacted onto the model's skin. Blurred high-tech laboratory backdrop, hyper-futuristic atmosphere.",
    category: "VFX Portrait",
    aspectRatio: "portrait",
    tags: ["Visor", "Augmented Reality", "Matrix Stream", "Lab"],
    author: "Studio"
  },
  {
    id: "g_31",
    title: "Quantum Glitch Phantom",
    imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "An artistic avant-garde VFX portrait of [YOUR FACE] with dynamic holographic pixel glitch fragments dissolving from the shoulders. High contrast retro grid background, vibrant pink and cyan chromatic aberration, highly-detailed digital face rendering with visual pixelations. Masterwork glitch art style, Unreal Engine 5 render.",
    category: "VFX Portrait",
    aspectRatio: "portrait",
    tags: ["Glitch", "Pixels", "Chromatic", "Quantum"],
    author: "Studio"
  },
  {
    id: "g_32",
    title: "Undersea Aqua Glow",
    imageUrl: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A gorgeous underwater VFX portrait of [YOUR FACE] surrounded by rich aqua-glow energy rings. Swirling schools of digital fish leave trails of cyan light as they swim. Luminous neon seaweed lines frame the background structure. The model's skin is illuminated by intense bioluminescent water currents, creating spectacular beauty contrast.",
    category: "VFX Portrait",
    aspectRatio: "portrait",
    tags: ["Underwater", "Bioluminescent", "Light Trails", "Siren"],
    author: "Studio"
  },
  {
    id: "g_33",
    title: "Exosuit Mech Pilot",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "An intense sci-fi VFX portrait of [YOUR FACE] as an interstellar Mech Pilot. The subject wears advanced titanium carbon-exosuit armor with glowing white and gold LED power lines. The background is the interior command bridge of an airship looking out into deep space fields filled with orange nebulas. Holographic targeting systems swirl around, high-end CGI.",
    category: "VFX Portrait",
    aspectRatio: "portrait",
    tags: ["Mech", "Exosuit", "Spaceship Cockpit", "HUD Star"],
    author: "Studio"
  },
  {
    id: "g_34",
    title: "Double Exposure Cyber",
    imageUrl: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "An artistic high-concept double exposure VFX portrait of [YOUR FACE] combined with a glowing cyberpunk city skyline. Towering digital skyscraper lights, vertical neon trails, and holographic billboards merge beautifully with the model's silhouette. Moody color grading with deep blues, purples, and amber key light on the jawline.",
    category: "VFX Portrait",
    aspectRatio: "portrait",
    tags: ["Double Exposure", "Cityscape", "Neon Trails", "Artistic"],
    author: "Studio"
  },
  {
    id: "g_35",
    title: "Android Faceline Repair",
    imageUrl: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "A stunning close-up VFX portrait of [YOUR FACE] transformed into an advanced android. Gorgeous glowing blue hardware seam divisions split the face slightly, revealing beautiful glowing neon gold circuits inside. Transparent cyber-shell material on temple and cheek side. Dark cyber lab background with robotic assembly arms in soft-focus and warning indicators.",
    category: "VFX Portrait",
    aspectRatio: "portrait",
    tags: ["Android", "Hardware Seams", "Cybernetic Core", "Circuit Lines"],
    author: "Studio"
  },
  {
    id: "g_36",
    title: "Anime Neon Ninja Sparks",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800",
    generationPrompt: "An anime cyber-ninja VFX portrait of [YOUR FACE] posing under heavy digital rain. A glowing, hot red electric katana generates circular spark patterns all around the body. Dark, atmospheric Tokyo warehouse roof backdrop with towering holographic dragon holograms floating. High speed shutter, rich particle sparks.",
    category: "VFX Portrait",
    aspectRatio: "portrait",
    tags: ["Ninja", "Sparks", "Katana", "Rain Tech"],
    author: "Studio"
  }
];

// Helper to shuffle array
export function shuffleGalleryItems(items: GalleryItem[]): GalleryItem[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
