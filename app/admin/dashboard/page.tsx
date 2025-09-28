import { getVerificationApplications } from "@/lib/getVerificationApplications";
import { getCurrentUser } from "@/hooks/getUser";
import { redirect } from "next/navigation";
import VerificationApplicationCard from "@/components/cards/VerificationApplicationCard";

export default async function AdminDashboard(){
    const user = await getCurrentUser();
    
    if (!user || user.role !== "ADMIN") {
        redirect("/");
    }

    const applications = await getVerificationApplications();

    return(
        <div className="link">
            <h1>Admin Dashboard</h1>
            <div className="card">
                <h2>Verification Applications</h2>
                {applications.length === 0 ? (
                    <p>No pending verification applications.</p>
                ) : (
                    <div className="space-y-4">
                        {/* Referral Applications (Priority) */}
                            {applications.filter((app) => app.referralCodeId).map((app) => (
                            <div key={app.id} className="border-l-4 border-green-500">
                                <VerificationApplicationCard application={app} />
                            </div>
                        ))}
                        
                        {/* Regular Applications */}
                            {applications.filter((app) => !app.referralCodeId).map((app) => (
                            <VerificationApplicationCard key={app.id} application={app} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

