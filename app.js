/* Resource Meta Information */
.resource-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
    color: var(--gray);
    margin: 0.5rem 0;
}

.resource-meta i {
    margin-right: 0.25rem;
}

/* Video Grid Styles */
.video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

.video-card {
    background: var(--white);
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    transition: transform 0.3s;
}

.video-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

.video-thumbnail {
    background: linear-gradient(135deg, #667eea, #764ba2);
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.video-thumbnail i {
    font-size: 4rem;
    color: white;
    opacity: 0.9;
}

.video-info {
    padding: 1rem;
}

.video-info h4 {
    margin-bottom: 0.25rem;
    color: var(--dark);
}

.video-info p {
    font-size: 0.875rem;
    color: var(--gray);
    margin-bottom: 0.75rem;
}

.video-info button {
    width: 100%;
    padding: 0.5rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
}

.video-info button:hover {
    background: var(--primary-dark);
}

/* Admin Item Actions */
.admin-item-actions {
    display: flex;
    gap: 0.5rem;
}

.admin-item-actions button {
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
}

/* Users Table */
.users-table-container {
    overflow-x: auto;
    margin-top: 1rem;
}

.users-table {
    width: 100%;
    border-collapse: collapse;
}

.users-table th,
.users-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
}

.users-table th {
    background: var(--light);
    font-weight: 600;
}

.users-table tr:hover {
    background: var(--light);
}

/* Responsive Improvements */
@media (max-width: 768px) {
    .resource-meta {
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .video-grid {
        grid-template-columns: 1fr;
    }
    
    .admin-item {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }
    
    .admin-item-actions {
        justify-content: center;
    }
}
