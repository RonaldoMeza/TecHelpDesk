import { apiFetch } from './api';

export function getTickets() {
  return apiFetch('/tickets');
}

export function getTicket(id) {
  return apiFetch(`/tickets/${id}`);
}

export function createTicket(data) {
  return apiFetch('/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTicket(id, data) {
  return apiFetch(`/tickets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function assignTicket(id, assigneeId) {
  return apiFetch(`/tickets/${id}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ assigneeId }),
  });
}

export function updateTicketStatus(id, data) {
  return apiFetch(`/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function addTicketHistory(id, comment) {
  return apiFetch(`/tickets/${id}/histories`, {
    method: 'POST',
    body: JSON.stringify({ comment }),
  });
}

export function getTicketHistories(id) {
  return apiFetch(`/tickets/${id}/histories`);
}

export function deleteTicket(id) {
  return apiFetch(`/tickets/${id}`, {
    method: 'DELETE',
  });
}

export function getSupportUsers() {
  return apiFetch('/users/support');
}
