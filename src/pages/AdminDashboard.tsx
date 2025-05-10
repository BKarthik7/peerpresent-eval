
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useRoom } from '@/context/RoomContext';
import { RoomCodeDisplay } from '@/components/ui/room-code-display';
import { ParticipantUpload } from '@/components/admin/ParticipantUpload';
import { TeamSetup } from '@/components/admin/TeamSetup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminDashboard = () => {
  const { isAdminLoggedIn, participants, teams } = useRoom();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in
    if (!isAdminLoggedIn) {
      navigate('/admin');
    }
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage participants, teams, and presentations</p>
          </div>
          
          <div className="md:max-w-xs w-full">
            <RoomCodeDisplay />
          </div>
        </div>
        
        <Tabs defaultValue="participants" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="presentation" disabled={teams.length === 0}>Presentation</TabsTrigger>
            <TabsTrigger value="evaluation" disabled={teams.length === 0}>Evaluation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="participants" className="space-y-6">
            <ParticipantUpload />
            
            {participants.length > 0 && (
              <div className="glass-morphism rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Uploaded Participants</h3>
                <div className="overflow-auto max-h-64">
                  <table className="w-full">
                    <thead className="text-xs text-muted-foreground">
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">USN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((participant, index) => (
                        <tr key={index} className="border-b border-white/5 text-sm">
                          <td className="py-3 px-4">{participant.name}</td>
                          <td className="py-3 px-4">{participant.usn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="teams" className="space-y-6">
            <TeamSetup />
            
            {teams.length > 0 && (
              <div className="glass-morphism rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Created Teams</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teams.map((team, index) => (
                    <div key={index} className="bg-secondary/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">{team.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {team.members.length} members
                      </p>
                      <ul className="text-sm space-y-1">
                        {team.members.map((member, mIndex) => (
                          <li key={mIndex} className="text-muted-foreground">
                            {member.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="presentation">
            <div className="glass-morphism rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium mb-4">Presentation Controls</h3>
              <p className="text-muted-foreground mb-6">
                This feature will be available in the next version
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="evaluation">
            <div className="glass-morphism rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium mb-4">Evaluation Setup</h3>
              <p className="text-muted-foreground mb-6">
                This feature will be available in the next version
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
