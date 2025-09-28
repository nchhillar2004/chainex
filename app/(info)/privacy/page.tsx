import { Config } from "@/config/config";
import SidebarLayout from "@/components/SidebarLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Privacy Policy | ${Config.name}`,
    description: "Privacy policy for ChainEX - how we collect, use, and protect your personal information."
};

export default function PrivacyPage(){
    return(
        <SidebarLayout>
            <div className="link">
                <div className="card">
                    <h1>Privacy Policy</h1>
                    <p className="text-sm text-gray-600 mb-6">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                    
                    <div className="space-y-6">
                        <section>
                            <h2>1. Introduction</h2>
                            <p>
                                ChainEX (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our student-only community platform.
                            </p>
                            <p className="mt-3">
                                By using ChainEX, you consent to the data practices described in this policy. If you do not agree with our practices, please do not use our platform.
                            </p>
                        </section>

                        <section>
                            <h2>2. Information We Collect</h2>
                            <div className="space-y-4">
                                <h3>2.1 Account Information</h3>
                                <p>When you create an account, we collect:</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Username and email address</li>
                                    <li>Password (encrypted and hashed)</li>
                                    <li>Full name and date of birth</li>
                                    <li>School/university name and email</li>
                                    <li>Profile information (bio, avatar)</li>
                                </ul>

                                <h3>2.2 Verification Information</h3>
                                <p>For student verification, we may collect:</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Student identification documents</li>
                                    <li>School enrollment verification</li>
                                    <li>Academic institution details</li>
                                    <li>Referral codes (if applicable)</li>
                                </ul>

                                <h3>2.3 Usage Information</h3>
                                <p>We automatically collect:</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Platform usage patterns and activity</li>
                                    <li>Posts, comments, and interactions</li>
                                    <li>Community participation (Chains joined)</li>
                                    <li>Device information and IP address</li>
                                    <li>Browser type and operating system</li>
                                    <li>Session data and cookies</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2>3. How We Use Your Information</h2>
                            <div className="space-y-3">
                                <h3>3.1 Platform Operations</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Provide and maintain ChainEX services</li>
                                    <li>Verify student status and eligibility</li>
                                    <li>Create and manage user accounts</li>
                                    <li>Enable community features and interactions</li>
                                    <li>Process transactions and communications</li>
                                </ul>

                                <h3>3.2 Safety and Security</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Monitor for inappropriate content or behavior</li>
                                    <li>Investigate reports and violations</li>
                                    <li>Prevent fraud and abuse</li>
                                    <li>Maintain platform security</li>
                                    <li>Comply with legal obligations</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2>4. Information Sharing and Disclosure</h2>
                            <div className="space-y-3">
                                <h3>4.1 We Do Not Sell Your Data</h3>
                                <p>
                                    ChainEX does not sell, rent, or trade your personal information to third parties for commercial purposes.
                                </p>

                                <h3>4.2 Limited Sharing</h3>
                                <p>We may share your information only in these circumstances:</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                                    <li><strong>Service Providers:</strong> Trusted third parties who help us operate the platform</li>
                                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                                    <li><strong>Safety Concerns:</strong> To prevent harm to users or the community</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2>5. Data Security</h2>
                            <p>We implement comprehensive security measures including encryption, secure password storage, regular security audits, and access controls to protect your information.</p>
                        </section>

                        <section>
                            <h2>6. Your Privacy Rights</h2>
                            <p>You have the right to access, update, delete, and export your personal information. You can request account deletion at any time.</p>
                        </section>

                        <section>
                            <h2>7. Contact Us</h2>
                            <p>If you have questions about this Privacy Policy, please contact us:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Email: privacy@chainex.edu</li>
                                <li>Support: support@chainex.edu</li>
                                <li>GitHub: <a href={`https://github.com/${Config.github.username}/${Config.github.repo}`} className="link" target="_blank" rel="noopener noreferrer">Report privacy concerns</a></li>
                            </ul>
                        </section>

                        <div className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)]">
                            <h3>Your Privacy Matters</h3>
                            <p>
                                We are committed to protecting your privacy and maintaining the trust you place in ChainEX. As students, your academic work and personal information deserve the highest level of protection.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}

