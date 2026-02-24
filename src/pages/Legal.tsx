import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function Legal() {
    const { page } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);

    const content = {
        "privacy-policy": {
            title: "Privacy Policy",
            body: `
                <p><strong>Last Updated:</strong> February 2026</p>
                <p>Welcome to AKA SOUNDS. We are committed to protecting your privacy and ensuring you have a secure experience on our website.</p>
                
                <h3>1. Information We Collect</h3>
                <p>We may collect personal information such as your name, email address, and payment details when you purchase our sample packs or sign up for our newsletter. This information is processed securely through our payment providers.</p>
                
                <h3>2. How We Use Your Information</h3>
                <p>Your information is used solely to process your transactions, deliver your purchased digital goods, and provide customer support. We may occasionally send promotional emails about new releases, which you can opt out of at any time.</p>
                
                <h3>3. Cookies and Tracking</h3>
                <p>We use essential cookies to maintain your session and ensure the website functions correctly.</p>
                
                <h3>4. Data Sharing</h3>
                <p>We do not sell, trade, or rent your personal information to third parties. Your data is only shared with necessary third-party service providers (like payment processors) to complete your transactions.</p>
            `
        },
        "terms-of-service": {
            title: "Terms of Service",
            body: `
                <p><strong>Last Updated:</strong> February 2026</p>
                <p>By accessing and using the AKA SOUNDS website, you accept and agree to be bound by the terms and provisions of this agreement.</p>
                
                <h3>1. License and Usage</h3>
                <p>All sample packs, presets, and audio files are 100% royalty-free. This means you can use them in your commercial and non-commercial musical productions without paying any royalties.</p>
                <p><strong>However, you may NOT:</strong></p>
                <ul>
                    <li>Resell, distribute, or share the files as they are (or slightly modified) as another sample pack.</li>
                    <li>Upload the raw isolated samples to platforms like Splice or similar services.</li>
                </ul>

                <h3>2. Digital Goods</h3>
                <p>Due to the nature of digital downloads, you are responsible for ensuring your hardware and software are compatible with our products (e.g., having a valid license of Serum for Serum presets).</p>
            `
        },
        "refund-policy": {
            title: "Refund Policy",
            body: `
                <p><strong>Last Updated:</strong> February 2026</p>
                
                <h3>3-Day Money-Back Guarantee</h3>
                <p>We stand behind the quality of our sounds. If you are not completely satisfied with your purchase, we offer a 3-day money-back guarantee under the following conditions:</p>
                <ul>
                    <li>You have encountered severe technical issues with the files that cannot be resolved.</li>
                    <li>The pack fundamentally misrepresents what was advertised on the product page.</li>
                </ul>
                
                <p>Because these are digital goods that cannot be "returned" in the traditional sense, refunds are granted at our discretion. If you simply "don't like" the sounds or purchased the wrong pack by mistake, refund requests may be declined.</p>
                <p>If you believe you qualify for a refund, please contact us within 3 days of your purchase.</p>
            `
        },
        "contact": {
            title: "Contact Us",
            body: `
                <p>Need support or have a question about a pack?</p>
                <p>You can reach out to us at any time. We usually respond within 24-48 hours.</p>
                
                <h3>Email</h3>
                <p><strong>contact@akasounds.com</strong></p>
                
                <h3>Social Media</h3>
                <p>Follow us and send us a direct message on Instagram: <strong><a href="https://www.instagram.com/aka_sounds/" target="_blank" rel="noopener noreferrer">@aka_sounds</a></strong></p>
            `
        }
    };

    const currentDoc = content[page as keyof typeof content];

    if (!currentDoc) {
        return (
            <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
                <h1 className="text-4xl font-display font-bold mb-4">Page not found</h1>
                <Link to="/" className="text-white/60 hover:text-white underline">Back to home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 relative">
            <div className="fixed inset-0 bg-grid pointer-events-none opacity-20 z-0" />

            <div className="max-w-3xl mx-auto px-6 relative z-10">
                <div className="mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>

                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-12">
                    {currentDoc.title}
                </h1>

                <div
                    className="prose prose-invert prose-lg max-w-none 
                        prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight
                        prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
                        prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-6
                        prose-strong:text-white
                        prose-a:text-white prose-a:underline hover:prose-a:text-white/80
                        prose-li:text-white/70
                        bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 backdrop-blur-sm"
                    dangerouslySetInnerHTML={{ __html: currentDoc.body }}
                />
            </div>
        </div>
    );
}
