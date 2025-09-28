import { Config } from "@/config/config";
import SidebarLayout from "@/components/SidebarLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Terms & Conditions | ${Config.name}`,
    description: "Terms and conditions for using ChainEX - the student-only community platform."
};

export default function TermsPage(){
    return(
        <SidebarLayout>
            <div className="link">
                <div className="card">
                    <h1>Terms and Conditions</h1>
                    <p className="text-sm text-gray-600 mb-6">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                    
                    <div className="space-y-6">
                        <section>
                            <h2>1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using ChainEX (&quot;the Platform&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                        </section>

                        <section>
                            <h2>2. Eligibility</h2>
                            <p className="mb-3">
                                ChainEX is exclusively for students enrolled in educational institutions. To use our platform, you must:
                            </p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Be currently enrolled as a student in a school, college, or university</li>
                                <li>Provide valid student identification during the verification process</li>
                                <li>Be at least 13 years of age</li>
                                <li>Have the legal capacity to enter into this agreement</li>
                            </ul>
                        </section>

                        <section>
                            <h2>3. User Accounts and Verification</h2>
                            <div className="space-y-3">
                                <p>
                                    To access ChainEX, you must create an account and complete our verification process:
                                </p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Provide accurate and complete information during registration</li>
                                    <li>Submit required student documentation for verification</li>
                                    <li>Maintain the security of your account credentials</li>
                                    <li>Notify us immediately of any unauthorized use of your account</li>
                                </ul>
                                <p>
                                    We reserve the right to reject verification applications or suspend accounts that do not meet our student verification requirements.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2>4. Acceptable Use Policy</h2>
                            <div className="space-y-3">
                                <h3>4.1 Permitted Uses</h3>
                                <p>You may use ChainEX for:</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Academic discussions and knowledge sharing</li>
                                    <li>Creating and participating in study groups (Chains)</li>
                                    <li>Asking questions and providing helpful answers</li>
                                    <li>Sharing educational resources and materials</li>
                                    <li>Collaborating with fellow students on academic projects</li>
                                </ul>

                                <h3>4.2 Prohibited Uses</h3>
                                <p>You may not use ChainEX to:</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Share content that violates academic integrity policies</li>
                                    <li>Post spam, advertisements, or commercial content</li>
                                    <li>Harass, bully, or intimidate other users</li>
                                    <li>Share personal information of others without consent</li>
                                    <li>Distribute copyrighted material without permission</li>
                                    <li>Attempt to circumvent our verification system</li>
                                    <li>Use automated tools to access the platform</li>
                                    <li>Engage in any illegal activities</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2>5. Content and Intellectual Property</h2>
                            <div className="space-y-3">
                                <h3>5.1 User-Generated Content</h3>
                                <p>
                                    You retain ownership of content you create and share on ChainEX. However, by posting content, you grant us a non-exclusive license to display, distribute, and modify your content as necessary to operate the platform.
                                </p>

                                <h3>5.2 Academic Integrity</h3>
                                <p>
                                    All users must maintain academic integrity. This includes proper citation of sources, avoiding plagiarism, and not sharing answers to assignments or exams inappropriately.
                                </p>

                                <h3>5.3 Platform Content</h3>
                                <p>
                                    ChainEX and its original content, features, and functionality are owned by ChainEX and are protected by international copyright, trademark, and other intellectual property laws.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2>6. Privacy and Data Protection</h2>
                            <p>
                                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information. By using ChainEX, you consent to the collection and use of information as outlined in our Privacy Policy.
                            </p>
                        </section>

                        <section>
                            <h2>7. Moderation and Enforcement</h2>
                            <div className="space-y-3">
                                <p>
                                    ChainEX employs both automated and human moderation to maintain a safe, academic environment:
                                </p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Content may be reviewed before or after posting</li>
                                    <li>Users can report inappropriate content or behavior</li>
                                    <li>Administrators may remove content or suspend accounts</li>
                                    <li>Appeals process available for moderation decisions</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2>8. Account Suspension and Termination</h2>
                            <div className="space-y-3">
                                <p>We may suspend or terminate your account if you:</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Violate these Terms and Conditions</li>
                                    <li>Engage in behavior that harms the community</li>
                                    <li>Provide false information during verification</li>
                                    <li>No longer meet our student eligibility requirements</li>
                                </ul>
                                <p>
                                    You may also terminate your account at any time by contacting our support team.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2>9. Disclaimers and Limitations</h2>
                            <div className="space-y-3">
                                <h3>9.1 Service Availability</h3>
                                <p>
                                    ChainEX is provided &quot;as is&quot; without warranties of any kind. We do not guarantee uninterrupted service availability or that the platform will be error-free.
                                </p>

                                <h3>9.2 Educational Content</h3>
                                <p>
                                    Content shared on ChainEX is provided by users and does not constitute professional educational advice. Users are responsible for verifying the accuracy of information shared on the platform.
                                </p>

                                <h3>9.3 Limitation of Liability</h3>
                                <p>
                                    ChainEX shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the platform.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2>10. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these Terms and Conditions at any time. We will notify users of significant changes through the platform or via email. Continued use of ChainEX after changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section>
                            <h2>11. Governing Law</h2>
                            <p>
                                These Terms and Conditions are governed by and construed in accordance with applicable laws. Any disputes arising from these terms will be resolved through appropriate legal channels.
                            </p>
                        </section>

                        <section>
                            <h2>12. Contact Information</h2>
                            <p>
                                If you have questions about these Terms and Conditions, please contact us at:
                            </p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Email: legal@chainex.edu</li>
                                <li>Support: support@chainex.edu</li>
                                <li>GitHub: <a href={`https://github.com/${Config.github.username}/${Config.github.repo}`} className="link" target="_blank" rel="noopener noreferrer">Report issues</a></li>
                            </ul>
                        </section>

                        <section>
                            <h2>13. Severability</h2>
                            <p>
                                If any provision of these Terms and Conditions is found to be unenforceable or invalid, the remaining provisions will continue to be valid and enforceable.
                            </p>
                        </section>

                        <div className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)]">
                            <h3>Important Notice</h3>
                            <p>
                                By using ChainEX, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. These terms constitute a legally binding agreement between you and ChainEX.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}

