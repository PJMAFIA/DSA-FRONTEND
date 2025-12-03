import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProtectedData, logout } from "../api/auth";

export default function Dashboard() {
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getProtectedData();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Failed to access protected data");
        logout();
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
      <Card className="w-full max-w-md card-shadow animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl gradient-finance bg-clip-text text-transparent">
            Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : (
            <p className="text-center">{data}</p>
          )}
          <Button className="w-full gradient-finance" onClick={handleLogout}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}