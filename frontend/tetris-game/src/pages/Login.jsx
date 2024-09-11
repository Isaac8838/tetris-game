import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginComponent from "@/features/Login/LoginComponent";
import RegisterComponent from "@/features/Login/RegisterComponent";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const Login = () => {
    const [tabValue, setTabValue] = useState("login");

    return (
        <div className="flex justify-center items-center flex-col pt-40">
            <h2 className="text-6xl text-white mb-6">Welcome</h2>

            <Tabs
                value={tabValue}
                onValueChange={(data) => setTabValue(data)}
                defaultValue="login"
                className="flex items-center flex-col gap-2 w-[40%]"
            >
                <TabsList className="w-full grid grid-cols-2 gap-2 h-auto">
                    <TabsTrigger value="login" className="text-lg">
                        Login
                    </TabsTrigger>
                    <TabsTrigger value="register" className="text-lg">
                        Register
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="w-full">
                    <Card className="p-4 bg-muted shadow-md">
                        <LoginComponent />
                    </Card>
                </TabsContent>
                <TabsContent value="register" className="w-full">
                    <Card className="p-4 bg-muted shadow-md">
                        <RegisterComponent setTabValue={setTabValue} />
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Login;
