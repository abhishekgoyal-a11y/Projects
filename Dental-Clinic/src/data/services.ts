import type { ServicePageData } from "@/types/service";

const city = "San Francisco";
const state = "CA";

export const services: ServicePageData[] = [
  {
    slug: "teeth-cleaning",
    seoTitle: `Teeth Cleaning in ${city}, ${state} | Professional Dental Hygiene`,
    metaDescription: `Professional teeth cleaning in ${city}. Gentle hygienists, digital X-rays & gum health assessments. Book your dental cleaning at Harborline Dental Studio today.`,
    hero: {
      eyebrow: `Dental Hygiene · ${city}`,
      headline: `Professional Teeth Cleaning in ${city}`,
      subheadline:
        "Remove plaque, prevent gum disease, and leave with a noticeably fresher smile — all in a calm, unhurried appointment with our expert hygienists.",
      priceFrom: "$189",
    },
    explanation: {
      title: "What is a professional teeth cleaning?",
      paragraphs: [
        `A professional teeth cleaning — also called prophylaxis or dental hygiene — goes far beyond what brushing and flossing achieve at home. At Harborline Dental Studio in ${city}, our hygienists use ultrasonic scalers and hand instruments to remove hardened tartar (calculus) and bacteria from above and below the gum line.`,
        "Regular cleanings are the foundation of preventive dentistry. The American Dental Association recommends cleanings every six months for most patients, though those with gum disease or higher risk factors may benefit from more frequent visits.",
        `Patients throughout Pacific Heights, the Marina, and greater ${city} choose Harborline for gentle technique, transparent pricing, and the peace of mind that comes from a thorough oral health assessment at every visit.`,
      ],
    },
    benefits: {
      title: "Benefits of regular dental cleanings",
      items: [
        {
          title: "Prevent gum disease",
          description:
            "Professional removal of plaque and tartar stops gingivitis before it progresses to periodontitis — the leading cause of adult tooth loss.",
        },
        {
          title: "Fresher breath",
          description:
            "Cleaning eliminates odor-causing bacteria trapped below the gum line that mouthwash alone cannot reach.",
        },
        {
          title: "Brighter smile",
          description:
            "Surface stain removal during polishing restores natural tooth brightness without whitening treatments.",
        },
        {
          title: "Early problem detection",
          description:
            "Each cleaning includes an exam to catch cavities, cracks, and oral cancer signs when treatment is simplest.",
        },
        {
          title: "Protect overall health",
          description:
            "Research links gum health to heart disease and diabetes management — cleanings support whole-body wellness.",
        },
        {
          title: "Save money long-term",
          description:
            "Preventive care costs a fraction of restorative treatments like crowns, root canals, or implants.",
        },
      ],
    },
    process: {
      title: "Your cleaning appointment, step by step",
      steps: [
        {
          title: "Health review & exam",
          description:
            "We review your medical history, discuss concerns, and perform a visual exam with digital X-rays when indicated.",
        },
        {
          title: "Plaque & tartar removal",
          description:
            "Ultrasonic and manual scaling gently removes buildup from tooth surfaces and along the gum line.",
        },
        {
          title: "Professional polishing",
          description:
            "A gritty paste polishes enamel to a smooth finish, removing surface stains and making it harder for plaque to adhere.",
        },
        {
          title: "Flossing & fluoride (optional)",
          description:
            "Thorough interdental cleaning followed by fluoride treatment for patients who need added cavity protection.",
        },
        {
          title: "Personalized care plan",
          description:
            "Your hygienist and dentist recommend a home care routine and schedule your next visit before you leave.",
        },
      ],
    },
    localSeo: {
      title: `Teeth cleaning near you in ${city}`,
      paragraphs: [
        `Harborline Dental Studio is conveniently located at ${city}'s Pacific Avenue, serving patients from Pacific Heights, the Marina District, Russian Hill, Nob Hill, Cow Hollow, and surrounding neighborhoods.`,
        `Searching for a "dentist near me" or "teeth cleaning ${city}"? We offer evening and Saturday appointments to fit busy ${city} schedules. New patients receive a comprehensive exam, cleaning, and treatment plan with upfront pricing.`,
      ],
    },
    faqs: [
      {
        question: "How much does a teeth cleaning cost in San Francisco?",
        answer:
          "Our new patient exam and cleaning starts at $189, including digital X-rays and a full assessment. Returning hygiene visits start at $149. We'll verify insurance benefits before your appointment and provide a written estimate.",
      },
      {
        question: "How often should I get my teeth cleaned?",
        answer:
          "Most patients benefit from cleanings every six months. If you have gum disease, smoke, or certain health conditions, we may recommend quarterly visits for optimal oral health.",
      },
      {
        question: "Does teeth cleaning hurt?",
        answer:
          "Cleanings should not be painful. If you have sensitive teeth or gum inflammation, let us know — we offer topical numbing gel and adjust technique for your comfort.",
      },
      {
        question: "Is a dental cleaning covered by insurance?",
        answer:
          "Most PPO dental plans cover two preventive cleanings per year at 80–100%. We accept Delta Dental, Cigna, Aetna, and most major plans and will verify your benefits before treatment.",
      },
      {
        question: "What's the difference between a cleaning and deep cleaning?",
        answer:
          "A standard cleaning removes plaque above the gum line. A deep cleaning (scaling and root planing) treats active gum disease below the gum line and may require multiple visits.",
      },
    ],
    cta: {
      headline: "Ready for a cleaner, healthier smile?",
      subheadline: "Book your professional teeth cleaning in San Francisco — new patient slots available this week.",
      primaryLabel: "Book Teeth Cleaning",
    },
    relatedSlugs: ["teeth-whitening", "pediatric-dentistry", "emergency-dentistry"],
  },
  {
    slug: "root-canal-treatment",
    seoTitle: `Root Canal Treatment in ${city}, ${state} | Gentle Endodontic Care`,
    metaDescription: `Expert root canal therapy in ${city}. Save your natural tooth with gentle, modern endodontic treatment. Same-day emergency root canals available. Book now.`,
    hero: {
      eyebrow: `Endodontics · ${city}`,
      headline: `Root Canal Treatment in ${city}`,
      subheadline:
        "Relieve tooth pain and save your natural tooth with precision root canal therapy — performed gently with modern technology and sedation options available.",
      priceFrom: "$1,200",
    },
    explanation: {
      title: "What is root canal treatment?",
      paragraphs: [
        "Root canal treatment — endodontic therapy — removes infected or inflamed pulp from inside a tooth, disinfects the canal system, and seals it to prevent reinfection. Despite its reputation, modern root canals are comparable to a routine filling in comfort.",
        `At Harborline Dental Studio in ${city}, we use digital imaging, rotary instrumentation, and dental microscopy to complete root canals efficiently — often in a single visit. Our goal is always to preserve your natural tooth rather than extract it.`,
        "Root canals become necessary when deep decay, repeated dental procedures, cracks, or trauma damage the tooth's nerve. Symptoms include persistent pain, sensitivity to heat or cold, swelling, or a darkening tooth.",
      ],
    },
    benefits: {
      title: "Why choose root canal over extraction?",
      items: [
        {
          title: "Save your natural tooth",
          description:
            "Nothing functions quite like your original tooth. Root canal therapy preserves your bite, jawbone, and smile aesthetics.",
        },
        {
          title: "Eliminate infection",
          description:
            "Removing infected pulp stops pain at its source and prevents bacteria from spreading to surrounding teeth and bone.",
        },
        {
          title: "Efficient & comfortable",
          description:
            "Modern techniques and local anesthesia make root canals no more uncomfortable than a standard filling for most patients.",
        },
        {
          title: "Avoid replacement costs",
          description:
            "Saving a tooth with a root canal is typically less expensive than extraction followed by an implant or bridge.",
        },
        {
          title: "Restore full function",
          description:
            "After a crown is placed, your treated tooth can chew normally for decades with proper care.",
        },
        {
          title: "Same-day emergency care",
          description:
            "We reserve daily emergency slots for patients with acute tooth pain requiring urgent root canal treatment.",
        },
      ],
    },
    process: {
      title: "The root canal process",
      steps: [
        {
          title: "Diagnosis & imaging",
          description:
            "Digital X-rays and clinical testing confirm whether root canal therapy is the right treatment for your tooth.",
        },
        {
          title: "Anesthesia & isolation",
          description:
            "The area is fully numbed. A dental dam isolates the tooth to keep it clean and dry during treatment.",
        },
        {
          title: "Pulp removal & cleaning",
          description:
            "Infected pulp is removed and canal walls are shaped and disinfected using rotary instruments and antimicrobial solutions.",
        },
        {
          title: "Canal filling & sealing",
          description:
            "Biocompatible gutta-percha fills and seals the canals to prevent reinfection.",
        },
        {
          title: "Crown restoration",
          description:
            "A custom crown is placed to protect the treated tooth and restore full strength — typically within two weeks.",
        },
      ],
    },
    localSeo: {
      title: `Root canal dentist near you in ${city}`,
      paragraphs: [
        `If you're searching for "root canal ${city}" or "endodontist near me," Harborline Dental Studio offers expert in-house endodontic care — no referral to an outside specialist required for most cases.`,
        `We serve patients across ${city} and the Bay Area with same-day emergency root canal appointments. Located on Pacific Avenue, we're easily accessible from Pacific Heights, the Marina, and downtown ${city}.`,
      ],
    },
    faqs: [
      {
        question: "Is a root canal painful?",
        answer:
          "Modern root canals are performed under local anesthesia and should not be painful. Most patients report the procedure itself is comfortable — the pain they experienced before treatment from the infection is what resolves afterward.",
      },
      {
        question: "How long does a root canal take?",
        answer:
          "Most root canals are completed in 60–90 minutes. Complex cases with multiple canals may require a second visit. We provide a clear timeline during your consultation.",
      },
      {
        question: "How much does a root canal cost in San Francisco?",
        answer:
          "Root canal fees vary by tooth location — front teeth start around $1,200, molars around $1,600. A crown is typically needed afterward ($1,400–$1,800). We provide a full written estimate and accept most PPO insurance.",
      },
      {
        question: "Do I need a crown after a root canal?",
        answer:
          "In most cases, yes — especially for back teeth. A crown protects the treated tooth from fracture and restores full chewing function. Front teeth may sometimes be restored with a filling alone.",
      },
      {
        question: "Can you do emergency root canals same-day?",
        answer:
          "Yes. Call us at (415) 555-0142 for same-day emergency root canal appointments. We prioritize patients with acute pain, swelling, or dental abscesses.",
      },
    ],
    cta: {
      headline: "Don't live with tooth pain another day",
      subheadline: "Schedule your root canal consultation in San Francisco — same-day emergency appointments available.",
      primaryLabel: "Book Root Canal Consultation",
    },
    relatedSlugs: ["crowns", "emergency-dentistry", "dental-implants"],
  },
  {
    slug: "dental-implants",
    seoTitle: `Dental Implants in ${city}, ${state} | Permanent Tooth Replacement`,
    metaDescription: `Dental implants in ${city} by board-certified specialists. 3D-guided placement, natural results & flexible financing. Free implant consultation. Book today.`,
    hero: {
      eyebrow: `Implant Dentistry · ${city}`,
      headline: `Dental Implants in ${city}`,
      subheadline:
        "Replace missing teeth with permanent, natural-looking dental implants — placed with 3D-guided precision by our restorative specialists.",
      priceFrom: "$3,800",
    },
    explanation: {
      title: "What are dental implants?",
      paragraphs: [
        "A dental implant is a titanium post surgically placed into the jawbone to replace a missing tooth root. Once integrated with bone, it supports a custom crown, bridge, or full-arch prosthesis that looks, feels, and functions like a natural tooth.",
        `Harborline Dental Studio in ${city} uses 3D CBCT imaging and guided surgery for precise implant placement — minimizing discomfort and optimizing long-term success. Our implant specialist, Dr. James Chen, has placed thousands of implants with a 98%+ success rate.`,
        "Implants are the gold standard for tooth replacement because they preserve jawbone, don't require grinding adjacent teeth, and can last a lifetime with proper care.",
      ],
    },
    benefits: {
      title: "Benefits of dental implants",
      items: [
        {
          title: "Permanent solution",
          description:
            "With proper care, dental implants can last 25 years or more — often a lifetime — unlike bridges or dentures that require replacement.",
        },
        {
          title: "Preserves jawbone",
          description:
            "Implant stimulation prevents the bone loss that occurs after tooth extraction, maintaining facial structure.",
        },
        {
          title: "Natural look & feel",
          description:
            "Custom crowns are color-matched and shaped to blend seamlessly with your surrounding teeth.",
        },
        {
          title: "Eat without restrictions",
          description:
            "Implants restore 90%+ of natural chewing force — enjoy steak, apples, and corn on the cob with confidence.",
        },
        {
          title: "Protects adjacent teeth",
          description:
            "Unlike bridges, implants don't require grinding down healthy neighboring teeth for support.",
        },
        {
          title: "High success rate",
          description:
            "Modern implants have a 95–98% success rate over 10 years when placed by experienced clinicians.",
        },
      ],
    },
    process: {
      title: "Your dental implant journey",
      steps: [
        {
          title: "Consultation & 3D scan",
          description:
            "CBCT imaging assesses bone quality and volume. We discuss options, timeline, and provide a detailed cost estimate.",
        },
        {
          title: "Implant placement",
          description:
            "The titanium post is placed under local anesthesia or sedation. Most patients return to normal activities within 24–48 hours.",
        },
        {
          title: "Healing & osseointegration",
          description:
            "Over 3–6 months, the implant fuses with jawbone. A temporary restoration may be provided for aesthetics.",
        },
        {
          title: "Abutment & impression",
          description:
            "Once healed, an abutment is attached and digital impressions are taken for your custom crown.",
        },
        {
          title: "Final crown delivery",
          description:
            "Your permanent crown is placed and bite-adjusted. We review care instructions and schedule follow-up.",
        },
      ],
    },
    localSeo: {
      title: `Dental implant specialist in ${city}`,
      paragraphs: [
        `Looking for "dental implants ${city}" or the "best implant dentist near me"? Harborline Dental Studio combines surgical expertise with boutique-level patient care on Pacific Avenue.`,
        `We welcome patients from across ${city}, Marin County, and the Peninsula. Complimentary implant consultations include a 3D scan and personalized treatment plan with transparent pricing.`,
      ],
    },
    faqs: [
      {
        question: "How much do dental implants cost in San Francisco?",
        answer:
          "A single dental implant with crown typically ranges from $3,800–$5,500 in San Francisco. This includes the implant post, abutment, and custom crown. We offer 0% APR financing and accept most PPO plans for partial coverage.",
      },
      {
        question: "Am I a candidate for dental implants?",
        answer:
          "Most adults with missing teeth and adequate bone volume are candidates. If bone loss has occurred, bone grafting can often restore candidacy. A 3D scan during your free consultation determines your options.",
      },
      {
        question: "How long do dental implants last?",
        answer:
          "With proper oral hygiene and regular checkups, implants can last 25+ years — often a lifetime. The crown may need replacement after 10–15 years due to normal wear.",
      },
      {
        question: "Is dental implant surgery painful?",
        answer:
          "Implant placement is performed under local anesthesia and is generally well-tolerated. Most patients report less discomfort than expected and manage with over-the-counter pain medication for 2–3 days.",
      },
      {
        question: "Dental implants vs. bridges — which is better?",
        answer:
          "Implants are preferred when replacing single teeth because they don't affect adjacent teeth and preserve bone. Bridges are faster and less expensive upfront but may need replacement every 10–15 years.",
      },
    ],
    cta: {
      headline: "Restore your smile with permanent implants",
      subheadline: "Book your complimentary dental implant consultation in San Francisco — includes 3D imaging.",
      primaryLabel: "Book Free Implant Consultation",
    },
    relatedSlugs: ["crowns", "bridges", "emergency-dentistry"],
  },
  {
    slug: "braces",
    seoTitle: `Braces in ${city}, ${state} | Traditional & Ceramic Orthodontics`,
    metaDescription: `Braces in ${city} for children, teens & adults. Metal, ceramic & self-ligating options. Free orthodontic consultation. Straighten your smile at Harborline Dental.`,
    hero: {
      eyebrow: `Orthodontics · ${city}`,
      headline: `Braces in ${city}`,
      subheadline:
        "Achieve a straighter, healthier smile with traditional or ceramic braces — customized treatment plans for children, teens, and adults.",
      priceFrom: "$4,500",
    },
    explanation: {
      title: "What are dental braces?",
      paragraphs: [
        "Dental braces use brackets bonded to teeth and archwires to gradually move teeth into proper alignment. They're the most versatile orthodontic treatment — effective for crowding, spacing, overbites, underbites, crossbites, and complex bite issues.",
        `At Harborline Dental Studio in ${city}, we offer metal braces, tooth-colored ceramic braces, and self-ligating systems that reduce friction and may shorten treatment time. Every plan is customized after a comprehensive orthodontic evaluation.`,
        "While clear aligners work well for mild to moderate cases, braces remain the gold standard for complex orthodontic corrections — especially in growing children and teens.",
      ],
    },
    benefits: {
      title: "Benefits of orthodontic braces",
      items: [
        {
          title: "Correct complex bite issues",
          description:
            "Braces address severe crowding, rotations, and jaw alignment problems that aligners alone may not correct.",
        },
        {
          title: "Improve oral health",
          description:
            "Straight teeth are easier to clean, reducing risk of cavities, gum disease, and uneven wear.",
        },
        {
          title: "Boost confidence",
          description:
            "A properly aligned smile improves self-esteem in social and professional settings.",
        },
        {
          title: "Options for every lifestyle",
          description:
            "Choose discreet ceramic braces or efficient metal braces based on your aesthetic preferences and budget.",
        },
        {
          title: "Suitable for all ages",
          description:
            "The American Association of Orthodontists recommends evaluation by age 7; adults benefit equally from treatment.",
        },
        {
          title: "Predictable results",
          description:
            "Braces provide precise, clinician-controlled tooth movement with decades of proven clinical outcomes.",
        },
      ],
    },
    process: {
      title: "Your braces treatment journey",
      steps: [
        {
          title: "Orthodontic consultation",
          description:
            "Digital scans, photos, and X-rays assess your bite. We discuss brace types, timeline, and cost.",
        },
        {
          title: "Treatment planning",
          description:
            "A custom plan maps each tooth's movement. You'll see a preview of your expected results.",
        },
        {
          title: "Brace placement",
          description:
            "Brackets are bonded to teeth and connected with archwires. The appointment takes 60–90 minutes.",
        },
        {
          title: "Adjustment visits",
          description:
            "Every 4–8 weeks, wires are adjusted to continue tooth movement. Most appointments are 20–30 minutes.",
        },
        {
          title: "Retainer phase",
          description:
            "After braces are removed, retainers maintain your new smile. We provide fixed and removable options.",
        },
      ],
    },
    localSeo: {
      title: `Orthodontist and braces near you in ${city}`,
      paragraphs: [
        `Searching for "braces ${city}" or an "orthodontist near me"? Harborline Dental Studio provides comprehensive orthodontic care for families across Pacific Heights, the Marina, Russian Hill, and greater ${city}.`,
        `We offer free orthodontic consultations for children, teens, and adults — including a digital scan and personalized treatment timeline with transparent pricing.`,
      ],
    },
    faqs: [
      {
        question: "How much do braces cost in San Francisco?",
        answer:
          "Traditional metal braces typically range from $4,500–$6,500 in San Francisco. Ceramic braces run $5,500–$7,500. We offer flexible monthly payment plans and accept most dental PPO insurance with orthodontic benefits.",
      },
      {
        question: "How long do I need to wear braces?",
        answer:
          "Average treatment time is 18–24 months, though mild cases may finish in 12 months and complex cases may take 30+ months. Your orthodontist provides a personalized estimate at consultation.",
      },
      {
        question: "Are braces or Invisalign better?",
        answer:
          "Braces are better for complex bite corrections and younger patients. Invisalign suits mild to moderate cases in disciplined adults and teens. We recommend the best option for your specific needs.",
      },
      {
        question: "What age should my child get braces?",
        answer:
          "The American Association of Orthodontists recommends a first evaluation by age 7. Early intervention can guide jaw growth and simplify future treatment, though many patients begin braces between ages 11–14.",
      },
      {
        question: "Do braces hurt?",
        answer:
          "You may feel pressure and soreness for 3–5 days after placement and after adjustments. Over-the-counter pain relievers and orthodontic wax for bracket irritation provide effective relief.",
      },
    ],
    cta: {
      headline: "Start your journey to a straighter smile",
      subheadline: "Book your free braces consultation in San Francisco — digital scan included.",
      primaryLabel: "Book Orthodontic Consultation",
    },
    relatedSlugs: ["invisalign", "pediatric-dentistry", "teeth-cleaning"],
  },
  {
    slug: "invisalign",
    seoTitle: `Invisalign in ${city}, ${state} | Clear Aligner Orthodontics`,
    metaDescription: `Invisalign clear aligners in ${city}. Discreet teeth straightening for adults & teens. Free smile preview consultation. Certified Invisalign provider.`,
    hero: {
      eyebrow: `Clear Aligners · ${city}`,
      headline: `Invisalign® in ${city}`,
      subheadline:
        "Straighten your teeth discreetly with custom Invisalign clear aligners — virtually invisible, removable, and designed for your lifestyle.",
      priceFrom: "$5,500",
    },
    explanation: {
      title: "What is Invisalign?",
      paragraphs: [
        "Invisalign is a system of custom-made, clear plastic aligners that gradually shift teeth into alignment. Each set is worn for 1–2 weeks before progressing to the next, applying controlled force to move teeth predictably.",
        `Harborline Dental Studio is a certified Invisalign provider in ${city}. We use iTero digital scanning — no messy impressions — to create your treatment plan and show a virtual preview of your future smile before you commit.`,
        "Invisalign is ideal for adults and teens who want orthodontic results without the visibility of metal braces. It's removable for eating, brushing, and special occasions.",
      ],
    },
    benefits: {
      title: "Benefits of Invisalign clear aligners",
      items: [
        {
          title: "Virtually invisible",
          description:
            "Clear aligners are barely noticeable — perfect for professionals and image-conscious patients.",
        },
        {
          title: "Removable convenience",
          description:
            "Take aligners out to eat, drink, brush, and floss normally. No food restrictions.",
        },
        {
          title: "Digital smile preview",
          description:
            "See your projected results before treatment begins with ClinCheck 3D simulation technology.",
        },
        {
          title: "Fewer office visits",
          description:
            "Receive multiple aligner sets at once — check-ins every 6–8 weeks instead of monthly adjustments.",
        },
        {
          title: "Comfortable fit",
          description:
            "Smooth plastic edges eliminate the bracket irritation common with traditional braces.",
        },
        {
          title: "Invisalign Teen available",
          description:
            "Compliance indicators and eruption tabs make Invisalign a great option for responsible teenagers.",
        },
      ],
    },
    process: {
      title: "Your Invisalign treatment process",
      steps: [
        {
          title: "Free consultation & scan",
          description:
            "Digital iTero scan captures your teeth in 3D. We assess candidacy and discuss goals.",
        },
        {
          title: "Custom treatment plan",
          description:
            "Invisalign ClinCheck software maps every tooth movement. You preview results before approving.",
        },
        {
          title: "Aligner fabrication",
          description:
            "Your custom aligner series is manufactured and delivered within 2–3 weeks.",
        },
        {
          title: "Wear & progress",
          description:
            "Wear aligners 20–22 hours daily, changing sets every 1–2 weeks. Attachments may be placed for complex movements.",
        },
        {
          title: "Retainers & maintenance",
          description:
            "Vivera retainers maintain your new smile. Periodic checkups ensure long-term stability.",
        },
      ],
    },
    localSeo: {
      title: `Invisalign provider near you in ${city}`,
      paragraphs: [
        `Looking for "Invisalign ${city}" or "clear aligners near me"? Harborline Dental Studio offers certified Invisalign treatment with digital scanning and complimentary smile previews.`,
        `We serve patients throughout ${city} — Pacific Heights, Marina, Russian Hill, Nob Hill, and beyond. Evening and Saturday consultations available for busy professionals.`,
      ],
    },
    faqs: [
      {
        question: "How much does Invisalign cost in San Francisco?",
        answer:
          "Invisalign in San Francisco typically ranges from $5,500–$8,000 depending on case complexity. We offer 0% APR financing and accept PPO insurance with orthodontic benefits. Your exact quote is provided at your free consultation.",
      },
      {
        question: "How long does Invisalign treatment take?",
        answer:
          "Average treatment is 12–18 months for adults. Mild cases may finish in 6 months; complex cases can take up to 24 months. Compliance (wearing aligners 20+ hours daily) is the biggest factor in timeline.",
      },
      {
        question: "Is Invisalign as effective as braces?",
        answer:
          "For mild to moderate crowding, spacing, and bite issues, Invisalign produces equivalent results. Complex rotations, severe bite problems, or significant vertical corrections may be better suited to braces.",
      },
      {
        question: "Can I eat and drink with Invisalign?",
        answer:
          "Remove aligners to eat and drink anything other than water. This prevents staining and damage. Brush before reinserting to avoid trapping food against teeth.",
      },
      {
        question: "Does Invisalign hurt?",
        answer:
          "You'll feel pressure for 1–3 days when starting each new aligner set — a sign teeth are moving. Discomfort is typically mild and manageable without medication.",
      },
    ],
    cta: {
      headline: "Preview your new smile before you start",
      subheadline: "Book your free Invisalign consultation in San Francisco — includes digital scan and smile simulation.",
      primaryLabel: "Book Free Invisalign Consultation",
    },
    relatedSlugs: ["braces", "veneers", "teeth-whitening"],
  },
  {
    slug: "teeth-whitening",
    seoTitle: `Teeth Whitening in ${city}, ${state} | Professional Zoom Whitening`,
    metaDescription: `Professional teeth whitening in ${city}. In-office Zoom whitening & take-home kits. Safe, dramatic results in one visit. Book your whitening appointment today.`,
    hero: {
      eyebrow: `Cosmetic Dentistry · ${city}`,
      headline: `Teeth Whitening in ${city}`,
      subheadline:
        "Brighten your smile up to 8 shades in a single visit with professional Zoom whitening — safe, fast, and dramatically more effective than drugstore kits.",
      priceFrom: "$499",
    },
    explanation: {
      title: "What is professional teeth whitening?",
      paragraphs: [
        "Professional teeth whitening uses clinical-strength peroxide gel activated by a special light or custom trays to break down deep stains within tooth enamel. Results are faster, safer, and more dramatic than over-the-counter strips or toothpastes.",
        `At Harborline Dental Studio in ${city}, we offer Philips Zoom in-office whitening — the most requested professional whitening system worldwide — as well as custom take-home trays for maintenance and gradual brightening.`,
        "Whitening works best on natural teeth with yellow or brown extrinsic stains from coffee, tea, wine, and aging. Gray tones from tetracycline or fluorosis may require veneers for optimal results.",
      ],
    },
    benefits: {
      title: "Benefits of professional whitening",
      items: [
        {
          title: "Dramatic results fast",
          description:
            "In-office Zoom whitening brightens teeth up to 8 shades in a single 60–90 minute appointment.",
        },
        {
          title: "Safer than DIY kits",
          description:
            "Dentist-supervised whitening protects gums and minimizes sensitivity with professional-grade desensitizers.",
        },
        {
          title: "Even, natural-looking results",
          description:
            "Custom application ensures uniform whitening without the patchy results common with store-bought strips.",
        },
        {
          title: "Boosts confidence",
          description:
            "A brighter smile is consistently ranked among the most impactful cosmetic improvements for self-esteem.",
        },
        {
          title: "Take-home maintenance",
          description:
            "Custom trays and professional gel keep your smile bright for years with periodic touch-ups.",
        },
        {
          title: "Pairs with other treatments",
          description:
            "Many patients whiten before veneers or bonding so restorations match their brightest natural shade.",
        },
      ],
    },
    process: {
      title: "Your whitening appointment",
      steps: [
        {
          title: "Shade assessment",
          description:
            "We document your starting shade and discuss realistic expectations based on your enamel type and staining.",
        },
        {
          title: "Gum protection",
          description:
            "A protective barrier shields gums and soft tissue from the whitening gel.",
        },
        {
          title: "Gel application & activation",
          description:
            "Professional-strength peroxide gel is applied in 3–4 cycles, activated by the Zoom light for 15 minutes each.",
        },
        {
          title: "Sensitivity management",
          description:
            "Fluoride desensitizer is applied post-treatment. We provide guidance for the first 48 hours.",
        },
        {
          title: "Results & maintenance plan",
          description:
            "Compare before/after shades and receive take-home trays or touch-up gel for lasting brightness.",
        },
      ],
    },
    localSeo: {
      title: `Professional teeth whitening near you in ${city}`,
      paragraphs: [
        `Searching for "teeth whitening ${city}" or "Zoom whitening near me"? Harborline Dental Studio on Pacific Avenue offers same-week whitening appointments for patients across ${city}.`,
        `Popular with professionals in Pacific Heights, the Marina, and downtown ${city}, our whitening treatments fit busy schedules — in and out in under 90 minutes with immediately visible results.`,
      ],
    },
    faqs: [
      {
        question: "How much does teeth whitening cost in San Francisco?",
        answer:
          "In-office Zoom whitening at Harborline starts at $499. Custom take-home whitening trays with professional gel are $299. We occasionally offer new patient whitening specials — ask when booking.",
      },
      {
        question: "How long do whitening results last?",
        answer:
          "Results typically last 1–3 years depending on diet and habits. Avoiding coffee, red wine, and tobacco extends brightness. Touch-up treatments every 6–12 months maintain your shade.",
      },
      {
        question: "Is teeth whitening safe?",
        answer:
          "Yes, when performed or supervised by a dentist. Professional whitening has decades of clinical safety data. Temporary sensitivity affects about 30% of patients and resolves within 24–48 hours.",
      },
      {
        question: "Will whitening work on crowns or veneers?",
        answer:
          "No — whitening gel only affects natural tooth enamel. Existing crowns and veneers won't change color. We recommend whitening before cosmetic work so restorations match your ideal shade.",
      },
      {
        question: "Zoom vs. take-home whitening — which is better?",
        answer:
          "In-office Zoom delivers faster, more dramatic results in one visit. Take-home trays offer gradual whitening over 2–3 weeks at a lower cost. Many patients combine both for best results.",
      },
    ],
    cta: {
      headline: "Brighten your smile this week",
      subheadline: "Book professional teeth whitening in San Francisco — results visible after one visit.",
      primaryLabel: "Book Whitening Appointment",
    },
    relatedSlugs: ["veneers", "teeth-cleaning", "invisalign"],
  },
  {
    slug: "veneers",
    seoTitle: `Porcelain Veneers in ${city}, ${state} | Smile Makeover Specialists`,
    metaDescription: `Porcelain veneers in ${city} by cosmetic specialists. Transform chips, gaps & discoloration. Complimentary smile design consultation. Book at Harborline Dental.`,
    hero: {
      eyebrow: `Cosmetic Dentistry · ${city}`,
      headline: `Porcelain Veneers in ${city}`,
      subheadline:
        "Transform your smile with hand-crafted porcelain veneers — custom-designed for natural luminosity, perfect proportions, and results that look effortlessly like you.",
      priceFrom: "$1,800",
    },
    explanation: {
      title: "What are porcelain veneers?",
      paragraphs: [
        "Porcelain veneers are ultra-thin shells of medical-grade ceramic bonded to the front surfaces of teeth. They correct chips, gaps, discoloration, misshapen teeth, and minor alignment issues — delivering a complete smile transformation in as few as two visits.",
        `Dr. Elena Vasquez, Harborline's founder and cosmetic specialist in ${city}, designs every veneer set using digital smile design software. Each restoration is individually shaped, shaded, and characterized to complement your facial features — never a one-size-fits-all \"Hollywood\" look.`,
        "Porcelain veneers are stain-resistant, durable, and reflect light like natural enamel — making them the premier choice for patients seeking a permanent cosmetic upgrade.",
      ],
    },
    benefits: {
      title: "Benefits of porcelain veneers",
      items: [
        {
          title: "Complete smile transformation",
          description:
            "Address multiple cosmetic concerns — color, shape, size, and spacing — in a single treatment.",
        },
        {
          title: "Natural aesthetics",
          description:
            "Custom ceramic mimics the translucency and light reflection of natural tooth enamel.",
        },
        {
          title: "Stain-resistant",
          description:
            "Porcelain resists coffee, wine, and tobacco staining far better than natural teeth or composite.",
        },
        {
          title: "Minimally invasive options",
          description:
            "Ultra-thin prep-less veneers preserve more natural tooth structure when appropriate.",
        },
        {
          title: "Long-lasting results",
          description:
            "Quality porcelain veneers last 10–20 years with proper care — among the longest-lasting cosmetic treatments.",
        },
        {
          title: "Confidence that shows",
          description:
            "Patients consistently report veneers as life-changing for personal and professional confidence.",
        },
      ],
    },
    process: {
      title: "Your veneer smile makeover",
      steps: [
        {
          title: "Smile design consultation",
          description:
            "Digital photos, scans, and smile design software preview your new smile. We discuss shape, shade, and goals.",
        },
        {
          title: "Tooth preparation",
          description:
            "A thin layer of enamel is conservatively shaped. Digital impressions are sent to our master ceramist.",
        },
        {
          title: "Temporary veneers",
          description:
            "Beautiful temporaries protect prepared teeth and let you \"test drive\" your new smile for 2–3 weeks.",
        },
        {
          title: "Try-in & bonding",
          description:
            "Final veneers are tried in for fit and aesthetics, then permanently bonded with clinical-grade cement.",
        },
        {
          title: "Final adjustments & care",
          description:
            "Bite is refined, polishing completed, and you receive a personalized care guide for long-term beauty.",
        },
      ],
    },
    localSeo: {
      title: `Cosmetic veneer dentist in ${city}`,
      paragraphs: [
        `Looking for "porcelain veneers ${city}" or a "smile makeover dentist near me"? Harborline Dental Studio is ${city}'s destination for bespoke cosmetic dentistry on Pacific Avenue.`,
        `We welcome patients from Pacific Heights, the Marina, Russian Hill, and across the Bay Area. Complimentary veneer consultations include digital smile design and a personalized treatment preview.`,
      ],
    },
    faqs: [
      {
        question: "How much do porcelain veneers cost in San Francisco?",
        answer:
          "Porcelain veneers in San Francisco typically range from $1,800–$2,500 per tooth at Harborline. A full smile of 8–10 veneers ranges from $14,400–$22,000. We offer financing and provide exact pricing at your complimentary consultation.",
      },
      {
        question: "How long do veneers last?",
        answer:
          "Quality porcelain veneers last 10–20 years. Longevity depends on oral habits — avoiding nail biting, grinding (use a nightguard), and maintaining regular dental visits.",
      },
      {
        question: "Do veneers ruin your teeth?",
        answer:
          "Modern veneer preparation removes only 0.3–0.7mm of enamel — less than the thickness of a fingernail. When performed by an experienced cosmetic dentist, veneers are a conservative and reversible-enough option.",
      },
      {
        question: "Veneers vs. bonding — what's the difference?",
        answer:
          "Veneers are custom ceramic made in a lab — more durable, stain-resistant, and aesthetic. Bonding is applied directly in-office — faster and less expensive but typically lasts 5–7 years and stains more easily.",
      },
      {
        question: "Can I see my results before committing?",
        answer:
          "Yes. We use digital smile design to preview your results before any tooth preparation. Temporary veneers during fabrication let you experience your new smile before final bonding.",
      },
    ],
    cta: {
      headline: "Design the smile you've always imagined",
      subheadline: "Book your complimentary veneer consultation in San Francisco — includes digital smile preview.",
      primaryLabel: "Book Veneer Consultation",
    },
    relatedSlugs: ["teeth-whitening", "crowns", "invisalign"],
  },
  {
    slug: "crowns",
    seoTitle: `Dental Crowns in ${city}, ${state} | Same-Day CEREC Crowns`,
    metaDescription: `Dental crowns in ${city}. Porcelain & same-day CEREC crowns to restore damaged teeth. Natural results, expert placement. Book your crown consultation today.`,
    hero: {
      eyebrow: `Restorative Dentistry · ${city}`,
      headline: `Dental Crowns in ${city}`,
      subheadline:
        "Restore strength, function, and beauty to damaged teeth with custom porcelain crowns — including same-day CEREC options milled in our office.",
      priceFrom: "$1,400",
    },
    explanation: {
      title: "What is a dental crown?",
      paragraphs: [
        "A dental crown is a custom cap that covers the entire visible portion of a damaged tooth, restoring its shape, size, strength, and appearance. Crowns protect teeth weakened by large fillings, fractures, root canals, or severe decay.",
        `Harborline Dental Studio in ${city} offers all-ceramic porcelain crowns and same-day CEREC crowns — designed, milled, and placed in a single visit using digital scanning and in-office milling technology.`,
        "Modern crowns are metal-free and color-matched to blend seamlessly with your natural teeth. With proper care, they last 10–15 years or longer.",
      ],
    },
    benefits: {
      title: "Benefits of dental crowns",
      items: [
        {
          title: "Restore full function",
          description:
            "Crowns return full chewing strength to teeth that would otherwise be at risk of fracture or extraction.",
        },
        {
          title: "Protect after root canal",
          description:
            "A crown is essential after root canal therapy to prevent treated teeth from cracking under bite force.",
        },
        {
          title: "Natural appearance",
          description:
            "All-ceramic crowns are indistinguishable from natural teeth in color, shape, and light reflection.",
        },
        {
          title: "Same-day option",
          description:
            "CEREC technology delivers a permanent crown in one visit — no temporary crown or second appointment.",
        },
        {
          title: "Long-term durability",
          description:
            "Quality porcelain crowns withstand daily chewing forces for 10–15+ years.",
        },
        {
          title: "Preserve your tooth",
          description:
            "Crowns save teeth that might otherwise require extraction, maintaining your natural smile and jawbone.",
        },
      ],
    },
    process: {
      title: "Getting your dental crown",
      steps: [
        {
          title: "Examination & preparation",
          description:
            "The tooth is assessed, decay removed, and shaped to accept the crown. Digital or traditional impressions are taken.",
        },
        {
          title: "Temporary crown (if needed)",
          description:
            "For lab-fabricated crowns, a temporary protects the tooth for 2–3 weeks. CEREC patients skip this step.",
        },
        {
          title: "Crown fabrication",
          description:
            "CEREC crowns are designed and milled in-office in 15–20 minutes. Lab crowns are crafted by expert ceramists.",
        },
        {
          title: "Fitting & adjustment",
          description:
            "The crown is tried in, bite checked, and adjusted for perfect fit and comfort.",
        },
        {
          title: "Permanent cementation",
          description:
            "The final crown is bonded with clinical cement. Care instructions are provided for long-term success.",
        },
      ],
    },
    localSeo: {
      title: `Dental crown dentist near you in ${city}`,
      paragraphs: [
        `Need a "dental crown ${city}" or "same-day crown near me"? Harborline Dental Studio offers both traditional and CEREC same-day crowns at our Pacific Avenue office.`,
        `We serve patients throughout ${city} — from Pacific Heights to the Marina and beyond — with transparent pricing and most PPO insurance accepted.`,
      ],
    },
    faqs: [
      {
        question: "How much does a dental crown cost in San Francisco?",
        answer:
          "Porcelain crowns at Harborline range from $1,400–$1,800 per tooth. Same-day CEREC crowns are similarly priced. Insurance typically covers 50% for medically necessary crowns. We verify benefits before treatment.",
      },
      {
        question: "How long do dental crowns last?",
        answer:
          "Porcelain crowns last 10–15 years on average, often longer with excellent oral hygiene and regular checkups. Avoid grinding and chewing hard objects to maximize longevity.",
      },
      {
        question: "What's the difference between a crown and a filling?",
        answer:
          "Fillings repair small to moderate cavities within a tooth. Crowns cover the entire tooth when damage is too extensive for a filling to support — such as after root canals or large fractures.",
      },
      {
        question: "Are same-day CEREC crowns as good as lab crowns?",
        answer:
          "CEREC crowns use high-quality ceramic and are excellent for most cases. Lab-fabricated crowns may offer superior aesthetics for highly visible front teeth with complex characterization.",
      },
      {
        question: "Does getting a crown hurt?",
        answer:
          "The procedure is performed under local anesthesia and is painless. Mild sensitivity for a few days after placement is normal and resolves quickly.",
      },
    ],
    cta: {
      headline: "Restore your tooth with a custom crown",
      subheadline: "Book your dental crown consultation in San Francisco — same-day CEREC available.",
      primaryLabel: "Book Crown Consultation",
    },
    relatedSlugs: ["root-canal-treatment", "bridges", "dental-implants"],
  },
  {
    slug: "bridges",
    seoTitle: `Dental Bridges in ${city}, ${state} | Replace Missing Teeth`,
    metaDescription: `Dental bridges in ${city} to replace 1-3 missing teeth. Fixed, natural-looking restorations. Restore your smile & bite. Book a bridge consultation today.`,
    hero: {
      eyebrow: `Restorative Dentistry · ${city}`,
      headline: `Dental Bridges in ${city}`,
      subheadline:
        "Replace one or more missing teeth with a fixed dental bridge — restoring your smile, bite, and confidence without removable appliances.",
      priceFrom: "$3,200",
    },
    explanation: {
      title: "What is a dental bridge?",
      paragraphs: [
        "A dental bridge is a fixed restoration that fills the gap left by one or more missing teeth. It consists of artificial teeth (pontics) anchored to crowns placed on the natural teeth adjacent to the gap — literally \"bridging\" the space.",
        `At Harborline Dental Studio in ${city}, we design bridges using all-ceramic materials for natural aesthetics and optimal gum health. Bridges are a proven, cost-effective alternative to implants when adjacent teeth already need crowns.`,
        "A well-maintained bridge restores proper chewing function, prevents remaining teeth from shifting, and maintains facial structure.",
      ],
    },
    benefits: {
      title: "Benefits of dental bridges",
      items: [
        {
          title: "Fixed & stable",
          description:
            "Unlike removable partial dentures, bridges are cemented in place — no slipping, clicking, or adhesives.",
        },
        {
          title: "Natural appearance",
          description:
            "All-ceramic pontics and crowns are shade-matched and shaped to blend with your smile.",
        },
        {
          title: "Restore chewing function",
          description:
            "Bridges distribute bite force properly, allowing you to eat comfortably on both sides.",
        },
        {
          title: "Prevent teeth shifting",
          description:
            "Filling gaps prevents adjacent teeth from drifting into the space, which causes bite problems.",
        },
        {
          title: "Faster than implants",
          description:
            "Bridges are typically completed in 2–3 weeks versus 3–6 months for implant osseointegration.",
        },
        {
          title: "Cost-effective",
          description:
            "Bridges are generally less expensive upfront than dental implants for replacing 1–3 teeth.",
        },
      ],
    },
    process: {
      title: "Getting your dental bridge",
      steps: [
        {
          title: "Consultation & planning",
          description:
            "We assess the gap, health of adjacent teeth, and discuss bridge vs. implant options with transparent pricing.",
        },
        {
          title: "Abutment preparation",
          description:
            "Anchor teeth are shaped for crowns. Digital impressions capture the exact dimensions of the gap.",
        },
        {
          title: "Temporary bridge",
          description:
            "A temporary bridge protects prepared teeth and maintains aesthetics while the permanent bridge is crafted.",
        },
        {
          title: "Bridge fabrication",
          description:
            "Our dental laboratory creates the custom bridge from high-quality ceramic over 2–3 weeks.",
        },
        {
          title: "Fitting & cementation",
          description:
            "The permanent bridge is tried in, adjusted for bite and fit, and permanently cemented.",
        },
      ],
    },
    localSeo: {
      title: `Dental bridge dentist near you in ${city}`,
      paragraphs: [
        `Searching for "dental bridge ${city}" or "replace missing tooth near me"? Harborline Dental Studio provides fixed bridge restorations for patients throughout ${city} and the Bay Area.`,
        `Located on Pacific Avenue, we serve Pacific Heights, the Marina, Russian Hill, and surrounding neighborhoods with expert restorative care and flexible financing.`,
      ],
    },
    faqs: [
      {
        question: "How much does a dental bridge cost in San Francisco?",
        answer:
          "A 3-unit porcelain bridge (replacing one tooth) at Harborline typically ranges from $3,200–$4,500. Costs vary based on the number of pontics and material. Insurance may cover 50% when medically necessary.",
      },
      {
        question: "How long do dental bridges last?",
        answer:
          "Dental bridges last 10–15 years on average with proper care. Oral hygiene around anchor teeth is critical — decay under crowns is the most common reason bridges fail.",
      },
      {
        question: "Bridge vs. implant — which should I choose?",
        answer:
          "Implants don't affect adjacent teeth and preserve bone — ideal when anchor teeth are healthy. Bridges are faster and less expensive when neighboring teeth already need crowns.",
      },
      {
        question: "Can a bridge replace more than one tooth?",
        answer:
          "Yes. Bridges can replace 1–3 consecutive missing teeth in most cases. Larger spans may require implant support for long-term stability.",
      },
      {
        question: "How do I care for a dental bridge?",
        answer:
          "Brush twice daily, floss under the pontic using a floss threader or water flosser, and maintain regular dental checkups. Proper cleaning prevents decay on anchor teeth.",
      },
    ],
    cta: {
      headline: "Fill the gap in your smile",
      subheadline: "Book your dental bridge consultation in San Francisco — we'll help you choose the best replacement option.",
      primaryLabel: "Book Bridge Consultation",
    },
    relatedSlugs: ["dental-implants", "crowns", "root-canal-treatment"],
  },
  {
    slug: "pediatric-dentistry",
    seoTitle: `Pediatric Dentist in ${city}, ${state} | Children's Dental Care`,
    metaDescription: `Pediatric dentist in ${city}. Gentle dental care for infants, children & teens. Positive first visits, preventive focus. Book your child's appointment today.`,
    hero: {
      eyebrow: `Children's Dentistry · ${city}`,
      headline: `Pediatric Dentistry in ${city}`,
      subheadline:
        "Give your child a positive foundation for lifelong oral health — with gentle, patient-centered dental care designed for growing smiles.",
      priceFrom: "$149",
    },
    explanation: {
      title: "What is pediatric dentistry?",
      paragraphs: [
        "Pediatric dentistry focuses on the oral health of infants, children, and adolescents — from first tooth eruption through the teen years. It encompasses preventive care, early orthodontic assessment, cavity treatment, and education tailored to young patients.",
        `Dr. Sarah Okonkwo leads children's dentistry at Harborline Dental Studio in ${city}. Her approach prioritizes positive experiences — using tell-show-do techniques, child-friendly language, and a warm environment that helps kids actually look forward to dental visits.`,
        "The American Academy of Pediatric Dentistry recommends a first dental visit by age 1 or within 6 months of the first tooth erupting. Early visits establish a dental home and catch issues before they become problems.",
      ],
    },
    benefits: {
      title: "Benefits of pediatric dental care",
      items: [
        {
          title: "Positive first experiences",
          description:
            "Early positive visits prevent dental anxiety that affects 36% of adults who had negative childhood experiences.",
        },
        {
          title: "Preventive focus",
          description:
            "Fluoride treatments, sealants, and hygiene education stop cavities before they start.",
        },
        {
          title: "Early problem detection",
          description:
            "Monitoring development catches alignment issues, thumb-sucking effects, and decay early.",
        },
        {
          title: "Child-specific expertise",
          description:
            "Pediatric-trained dentists understand children's behavior, growth patterns, and developmental milestones.",
        },
        {
          title: "Family convenience",
          description:
            "Parents and children can be seen at the same practice — saving time and building family trust.",
        },
        {
          title: "Habit counseling",
          description:
            "Guidance on pacifier use, thumb sucking, and nutrition supports healthy oral development.",
        },
      ],
    },
    process: {
      title: "Your child's dental visit",
      steps: [
        {
          title: "Warm welcome & tour",
          description:
            "We introduce your child to the office, team, and equipment in a fun, low-pressure way.",
        },
        {
          title: "Gentle examination",
          description:
            "A knee-to-knee exam for toddlers or chair exam for older children assesses teeth, gums, and development.",
        },
        {
          title: "Cleaning & fluoride",
          description:
            "Age-appropriate cleaning and fluoride varnish protect developing teeth.",
        },
        {
          title: "Digital X-rays (when needed)",
          description:
            "Low-radiation digital X-rays detect cavities between teeth not visible during exam.",
        },
        {
          title: "Parent education & next visit",
          description:
            "We review home care tips, answer parent questions, and schedule the next checkup.",
        },
      ],
    },
    localSeo: {
      title: `Kids dentist near you in ${city}`,
      paragraphs: [
        `Looking for a "pediatric dentist ${city}" or "children's dentist near me"? Harborline Dental Studio welcomes families from Pacific Heights, the Marina, Laurel Heights, and across ${city}.`,
        `Our kid-friendly office on Pacific Avenue offers Saturday appointments for busy families. New patient children's visits include an exam, cleaning, and parent consultation starting at $149.`,
      ],
    },
    faqs: [
      {
        question: "When should my child first see a dentist?",
        answer:
          "The American Academy of Pediatric Dentistry recommends a first visit by age 1 or within 6 months of the first tooth appearing. Early visits establish comfort and catch developmental concerns.",
      },
      {
        question: "How much does a children's dental visit cost?",
        answer:
          "Children's exams and cleanings start at $149 at Harborline. Most family dental PPO plans cover two preventive visits per year at 100% for children.",
      },
      {
        question: "How do you help anxious children?",
        answer:
          "We use tell-show-do communication, positive reinforcement, and a child-friendly environment. For very anxious children, nitrous oxide (laughing gas) is available as a safe sedation option.",
      },
      {
        question: "Are dental X-rays safe for children?",
        answer:
          "Yes. Digital dental X-rays emit up to 90% less radiation than traditional film. We only take X-rays when clinically necessary and use lead aprons for protection.",
      },
      {
        question: "What are dental sealants?",
        answer:
          "Sealants are thin protective coatings applied to chewing surfaces of back teeth. They prevent 80% of cavities in molars and are recommended for children ages 6–12.",
      },
    ],
    cta: {
      headline: "Give your child a great start with dental care",
      subheadline: "Book your child's first or next visit at our San Francisco pediatric dental practice.",
      primaryLabel: "Book Children's Appointment",
    },
    relatedSlugs: ["teeth-cleaning", "braces", "emergency-dentistry"],
  },
  {
    slug: "emergency-dentistry",
    seoTitle: `Emergency Dentist in ${city}, ${state} | Same-Day Dental Care`,
    metaDescription: `Emergency dentist in ${city} open for same-day appointments. Toothache, broken teeth, knocked-out teeth & dental trauma. Call (415) 555-0142 now.`,
    hero: {
      eyebrow: `Urgent Dental Care · ${city}`,
      headline: `Emergency Dentist in ${city}`,
      subheadline:
        "Toothache, broken tooth, or dental trauma? We reserve same-day emergency appointments every day — call now and we'll prioritize your care.",
      priceFrom: undefined,
    },
    explanation: {
      title: "When do you need emergency dental care?",
      paragraphs: [
        "Dental emergencies require prompt professional attention to relieve pain, save teeth, and prevent infection from spreading. Common emergencies include severe toothaches, knocked-out teeth, broken or cracked teeth, lost fillings or crowns, abscesses, and soft tissue injuries.",
        `Harborline Dental Studio in ${city} reserves emergency appointment slots daily. Call (415) 555-0142 and our team will triage your situation and get you seen as quickly as possible — often the same day.`,
        "Knowing what to do in the first minutes after a dental injury can mean the difference between saving and losing a tooth. Our team provides after-hours guidance for true emergencies.",
      ],
    },
    benefits: {
      title: "Why choose Harborline for dental emergencies",
      items: [
        {
          title: "Same-day appointments",
          description:
            "We hold emergency slots open daily — not just during business hours. Call and we'll find you the earliest available time.",
        },
        {
          title: "Full-service emergency care",
          description:
            "Extractions, root canals, crown re-cementation, trauma repair, and infection treatment — all in-house.",
        },
        {
          title: "Pain relief first",
          description:
            "Your comfort is our immediate priority. We address pain and stabilize your condition before discussing long-term treatment.",
        },
        {
          title: "Experienced trauma team",
          description:
            "Our clinicians handle dental emergencies daily — from simple lost fillings to complex trauma cases.",
        },
        {
          title: "Sedation available",
          description:
            "Nitrous oxide and oral sedation help anxious patients receive urgent care comfortably.",
        },
        {
          title: "Transparent emergency pricing",
          description:
            "You'll receive a clear estimate before treatment begins — no surprise bills during a stressful moment.",
        },
      ],
    },
    process: {
      title: "What to do in a dental emergency",
      steps: [
        {
          title: "Call us immediately",
          description:
            "Phone (415) 555-0142. Describe your symptoms and we'll schedule the earliest emergency slot or provide guidance.",
        },
        {
          title: "Knocked-out tooth?",
          description:
            "Handle by the crown only. Rinse gently, try to reinsert, or store in milk/saliva. See us within 30 minutes for best chance of saving the tooth.",
        },
        {
          title: "Severe toothache?",
          description:
            "Rinse with warm salt water, floss gently to remove debris, and take ibuprofen. Avoid aspirin on gums — it can burn tissue.",
        },
        {
          title: "Broken tooth or lost crown?",
          description:
            "Save any fragments, rinse your mouth, and apply dental wax or sugar-free gum to sharp edges. Bring the crown if possible.",
        },
        {
          title: "Come in for treatment",
          description:
            "We'll diagnose, relieve pain, and create a treatment plan. Follow-up care is scheduled before you leave.",
        },
      ],
    },
    localSeo: {
      title: `Emergency dentist near you in ${city}`,
      paragraphs: [
        `Searching for an "emergency dentist ${city}," "dentist open now," or "toothache dentist near me"? Harborline Dental Studio on Pacific Avenue serves urgent dental needs across ${city} — Pacific Heights, Marina, Russian Hill, Nob Hill, and downtown.`,
        `Don't wait in pain. Our ${city} emergency dental team is available Mon–Fri 8am–6pm and Sat 9am–2pm with same-day slots reserved daily. After-hours callers receive on-call clinician guidance.`,
      ],
    },
    faqs: [
      {
        question: "What counts as a dental emergency?",
        answer:
          "Severe pain, knocked-out teeth, uncontrolled bleeding, facial swelling, abscesses, large fractures, and trauma to teeth or jaw are emergencies. Mild sensitivity or a small chip can usually wait for a regular appointment.",
      },
      {
        question: "How much does an emergency dental visit cost?",
        answer:
          "Emergency exam fees start at $149. Treatment costs vary — a simple re-cementation differs from a root canal or extraction. We provide pricing before proceeding and accept most PPO insurance.",
      },
      {
        question: "Can you save a knocked-out tooth?",
        answer:
          "Yes, if you reach us within 30–60 minutes. Keep the tooth moist in milk or saliva, handle only the crown, and don't scrub it. Success rates exceed 90% when reimplanted quickly.",
      },
      {
        question: "Do you offer emergency dental care on weekends?",
        answer:
          "We offer Saturday emergency slots 9am–2pm. For after-hours emergencies, call (415) 555-0142 for on-call guidance and next-available appointment scheduling.",
      },
      {
        question: "Should I go to the ER or the dentist?",
        answer:
          "Visit the ER for jaw fractures, uncontrolled bleeding, or swelling affecting breathing. For tooth-specific emergencies — pain, knocked-out teeth, infections — a dentist provides faster, more targeted care.",
      },
    ],
    cta: {
      headline: "Dental emergency? Don't wait in pain.",
      subheadline: "Call our San Francisco emergency dental line now — same-day appointments available.",
      primaryLabel: "Call Emergency Line",
    },
    relatedSlugs: ["root-canal-treatment", "crowns", "teeth-cleaning"],
  },
];

export function getServiceBySlug(slug: string): ServicePageData | undefined {
  return services.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}
