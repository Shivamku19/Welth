import { getUserAccounts } from "@/actions/dashboard";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { AccountCard } from "@/components/account-card";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const accounts = await getUserAccounts();

  return (
    <div className="space-y-8 px-4">
      <h1 className="text-6xl font-bold tracking-tighter text-blue-600 mb-8">Dashboard</h1>
      
      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed h-full flex items-center justify-center py-6">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground p-0">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {accounts.length > 0 &&
          accounts.map((account) => {
            return <AccountCard key={account.id} account={account} />;
          })}
      </div>
    </div>
  );
}
