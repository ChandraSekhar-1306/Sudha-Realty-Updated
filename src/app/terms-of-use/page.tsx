
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
            {children}
        </div>
    </div>
);

export default function TermsOfUsePage() {
  return (
    <div className="bg-background">
        <div className="container py-16 sm:py-24">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">Terms of Use</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </header>

                <Card>
                    <CardContent className="p-8 md:p-10">
                        <Section title="1. Agreement to Terms">
                            <p>
                                By accessing or using our website, https://www.sudharealty.in (the "Site"), you agree to be bound by these Terms of Use. If you disagree with any part of the terms, then you do not have permission to access the Site.
                            </p>
                        </Section>

                        <Section title="2. Description of Services">
                            <p>Sudha Realty provides a platform with three main services:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>
                                    <strong>Curated Property Listings:</strong> Properties vetted and managed by Sudha Realty.
                                </li>
                                <li>
                                    <strong>Community Platform:</strong> A platform for property owners to list their properties for rent or sale, and for users to inquire about these listings.
                                </li>
                                <li>
                                    <strong>Paid Consultation:</strong> A service where users can book a personalized real estate consultation session.
                                </li>
                            </ul>
                        </Section>

                        <Section title="3. Community Platform Disclaimer">
                            <p>
                                The "Community Listings" section of the Site is a platform for independent property owners to post listings. Sudha Realty does not inspect, verify, or endorse these community listings. We are not a party to any transaction or communication between the property owner and the interested party.
                            </p>
                            <p>
                                All information on community listings is provided by the owner. We make no representations or warranties as to the accuracy, legality, or quality of these listings. Users are strongly advised to conduct their own due diligence before entering into any agreements. Sudha Realty is not liable for any disputes, losses, or damages arising from transactions related to community listings.
                            </p>
                        </Section>
                        
                         <Section title="4. User Conduct">
                            <p>You agree not to use the Site to:</p>
                             <ul className="list-disc list-inside space-y-2">
                                <li>Post any content that is false, misleading, unlawful, or defamatory.</li>
                                <li>Impersonate any person or entity.</li>
                                <li>Engage in any activity that could harm the Site or its users.</li>
                                <li>Use any automated system, including without limitation "robots," "spiders," or "offline readers," to access the Site in a manner that sends more request messages to the servers than a human can reasonably produce in the same period by using a conventional on-line web browser.</li>
                            </ul>
                        </Section>

                        <Section title="5. Intellectual Property">
                            <p>
                                The Site and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Sudha Realty and its licensors.
                            </p>
                        </Section>

                        <Section title="6. Limitation of Liability">
                            <p>
                                In no event shall Sudha Realty, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Site; (ii) any conduct or content of any third party on the Site; (iii) any content obtained from the Site; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory.
                            </p>
                        </Section>

                        <Section title="7. Governing Law">
                             <p>
                                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                            </p>
                        </Section>

                        <Section title="8. Contact Us">
                            <p>If you have any questions about these Terms, please contact us at:</p>
                            <p>Email: admin@sudharealty.in</p>
                        </Section>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
