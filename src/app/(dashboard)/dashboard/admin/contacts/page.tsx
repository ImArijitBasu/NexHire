'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminContactsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      try { const res = await adminAPI.getContacts(); return res.data; }
      catch { return { data: [] }; }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminAPI.updateContactStatus(id, status),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-contacts'] }); toast.success('Status updated'); },
    onError: () => toast.error('Failed to update'),
  });

  const contacts = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Mail className="h-7 w-7 text-primary" /> Contact Messages
        </h1>
        <p className="text-muted-foreground">View and manage user-submitted contact messages.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>All Messages ({contacts.length})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No contact messages yet.</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((c: any) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground">{c.email}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{c.subject}</TableCell>
                      <TableCell>
                        <Badge variant={c.status === 'read' ? 'secondary' : 'default'}>
                          {c.status === 'read' ? 'Read' : 'Unread'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{c.createdAt ? format(new Date(c.createdAt), 'MMM d, yyyy') : '—'}</TableCell>
                      <TableCell className="text-right">
                        {c.status !== 'read' && (
                          <Button variant="ghost" size="sm" className="text-xs" onClick={() => updateMutation.mutate({ id: c.id, status: 'read' })}>
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Mark Read
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
