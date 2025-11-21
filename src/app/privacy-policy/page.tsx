
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
            {children}
        </div>
    </div>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background">
        <div className="container py-16 sm:py-24">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">Privacy Policy</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </header>

                <Card>
                    <CardContent className="p-8 md:p-10">
                        <Section title="1. Introduction">
                            <p>
                                Welcome to Sudha Realty ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website https://www.sudharealty.in, including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the "Site").
                            </p>
                        </Section>

                        <Section title="2. Information We Collect">
                            <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>
                                    <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you fill out a contact form, submit a consultation request, or make an inquiry on a community listing.
                                </li>
                                <li>
                                    <strong>Financial Data:</strong> We collect transaction IDs from payments made for our consultation services. We do not collect or store any payment card details. All payment processing is handled by third-party UPI providers.
                                </li>
                                <li>
                                    <strong>Data from Community Listings:</strong> When you submit a property for our community platform, we collect all information you provide, including property details and owner contact information.
                                </li>
                                 <li>
                                    <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
                                </li>
                            </ul>
                        </Section>

                        <Section title="3. Use of Your Information">
                            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Administer consultation requests and verify payments.</li>
                                <li>Connect interested parties with property owners on the Community Platform.</li>
                                <li>Respond to your inquiries and provide customer support.</li>
                                <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                                <li>Protect the security and integrity of our Site.</li>
                            </ul>
                        </Section>
                        
                         <Section title="4. Disclosure of Your Information">
                            <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>
                                    <strong>For Community Listings:</strong> If you make an inquiry on a community listing, we will share your name and phone number with the property owner to facilitate communication. By making an inquiry, you consent to this sharing.
                                </li>
                                 <li>
                                    <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
                                </li>
                                <li>
                                    <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services, and customer service. (e.g., Formspree for contact forms).
                                </li>
                            </ul>
                        </Section>

                        <Section title="5. Security of Your Information">
                            <p>
                                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                            </p>
                        </Section>

                        <Section title="6. Policy for Children">
                            <p>
                                We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
                            </p>
                        </Section>

                        <Section title="7. Changes to This Privacy Policy">
                             <p>
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                            </p>
                        </Section>

                        <Section title="8. Contact Us">
                            <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
                            <p>Email: admin@sudharealty.in</p>
                        </Section>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
