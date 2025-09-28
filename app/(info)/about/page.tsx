import { Config } from "@/config/config";
import SidebarLayout from "@/components/SidebarLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `About Us | ${Config.name}`,
    description: "Learn about ChainEX - the student-only community platform for connecting, sharing, and learning in a secure environment."
};

export default function AboutPage(){
    return(
        <SidebarLayout>
            <div className="link">
                <div className="card">
                    <h1>About ChainEX</h1>
                    <p className="text-lg mb-6">
                        ChainEX is a revolutionary student-only community platform designed to create a safe, secure, and productive environment for students to connect, share knowledge, and learn together.
                    </p>
                    
                    <h2>Our Mission</h2>
                    <p className="mb-4">
                        We believe that education thrives in collaborative environments. Our mission is to provide students with a dedicated platform where they can freely exchange ideas, ask questions, share resources, and build meaningful academic connections without the distractions and risks present on general social media platforms.
                    </p>
                    
                    <h2>What Makes ChainEX Different?</h2>
                    <div className="space-y-4 mb-6">
                        <div>
                            <h3>🎓 Student-Only Environment</h3>
                            <p>ChainEX is exclusively for students from schools and universities. Our verification system ensures that only legitimate students can access the platform, creating a focused academic community.</p>
                        </div>
                        
                        <div>
                            <h3>🔒 Ultra-Secure & Private</h3>
                            <p>We prioritize your privacy and security. All data is encrypted, and we implement strict privacy controls to protect your personal information and academic work.</p>
                        </div>
                        
                        <div>
                            <h3>📚 Academic-Focused Features</h3>
                            <p>Our platform is designed specifically for academic collaboration with features like study groups (Chains), Q&A forums, resource sharing, and knowledge exchange.</p>
                        </div>
                        
                        <div>
                            <h3>🌐 Open Source & Transparent</h3>
                            <p>ChainEX is completely open source, meaning you can inspect our code, contribute to development, and trust that we&apos;re not hiding anything from our community.</p>
                        </div>
                    </div>
                    
                    <h2>Core Features</h2>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <h3>Community Chains</h3>
                            <p>Create or join subject-specific communities where you can discuss topics, share resources, and collaborate with peers.</p>
                        </div>
                        
                        <div>
                            <h3>Thread Discussions</h3>
                            <p>Engage in detailed discussions through our threaded conversation system with voting, replies, and topic organization.</p>
                        </div>
                        
                        <div>
                            <h3>Verification System</h3>
                            <p>Secure student verification ensures authentic academic community participation and prevents spam or inappropriate content.</p>
                        </div>
                        
                        <div>
                            <h3>Moderation Tools</h3>
                            <p>Community-driven moderation with admin oversight ensures respectful and productive discussions.</p>
                        </div>
                        
                        <div>
                            <h3>Resource Sharing</h3>
                            <p>Share study materials, notes, and educational resources with your peers in a organized manner.</p>
                        </div>
                        
                        <div>
                            <h3>Real-time Collaboration</h3>
                            <p>Instant notifications and real-time updates keep you connected with your academic community.</p>
                        </div>
                    </div>
                    
                    <h2>Our Technology</h2>
                    <p className="mb-4">
                        ChainEX is built using modern, secure technologies including Next.js, TypeScript, Prisma ORM, MySQL database, and Redis for session management. Our architecture ensures fast, reliable, and scalable performance.
                    </p>
                    
                    <h2>Community Guidelines</h2>
                    <p className="mb-4">
                        We maintain a respectful, academic-focused environment through clear community guidelines. Users are expected to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mb-6">
                        <li>Respect fellow students and maintain academic integrity</li>
                        <li>Share knowledge constructively and help others learn</li>
                        <li>Follow proper citation practices when sharing resources</li>
                        <li>Report inappropriate content or behavior</li>
                        <li>Maintain privacy and not share personal information inappropriately</li>
                    </ul>
                    
                    <h2>Getting Started</h2>
                    <p className="mb-4">
                        To join ChainEX, you&apos;ll need to:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 mb-6">
                        <li>Create an account with your student email</li>
                        <li>Complete the verification process by providing student documentation</li>
                        <li>Wait for admin approval (typically within 48 hours)</li>
                        <li>Start exploring communities and connecting with peers!</li>
                    </ol>
                    
                    <h2>Our Commitment</h2>
                    <p className="mb-4">
                        We are committed to providing a platform that truly serves the academic community. This means:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mb-6">
                        <li>Continuous improvement based on student feedback</li>
                        <li>Maintaining the highest standards of privacy and security</li>
                        <li>Ensuring fair and transparent moderation</li>
                        <li>Supporting academic integrity and collaboration</li>
                        <li>Keeping the platform free and accessible to all students</li>
                    </ul>
                    
                    <h2>Contact Us</h2>
                    <p className="mb-4">
                        Have questions, suggestions, or need support? We&apos;re here to help! You can reach us through:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mb-6">
                        <li>Email: support@chainex.edu</li>
                        <li>GitHub: <a href={`https://github.com/${Config.github.username}/${Config.github.repo}`} className="link" target="_blank" rel="noopener noreferrer">View our source code</a></li>
                        <li>Community reports and feedback system</li>
                    </ul>
                    
                    <div className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)]">
                        <h3>Join the ChainEX Community Today!</h3>
                        <p>
                            Ready to connect with fellow students and enhance your learning experience? 
                            <a href="/auth/register" className="link font-semibold"> Create your account</a> and start your academic journey with ChainEX.
                        </p>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
