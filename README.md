# CityAlert

CityAlert is a Smart City web application for reporting, managing, and tracking urban incidents such as potholes, faulty street lighting, sanitation issues, and other public infrastructure problems.

## Purpose

The platform helps citizens submit incident reports and allows municipal staff to organize interventions, assign teams, monitor progress, and communicate updates in a structured way.

## Technologies

- Backend: Spring Boot 3, Kotlin, Gradle
- Frontend: React, Vite
- Database: PostgreSQL
- Persistence: Spring Data JPA
- Database migrations: Liquibase
- Authentication and authorization: JWT + role-based access control
- API documentation: OpenAPI / Swagger
- Email notifications: MailTrap SMTP
- Environment: Docker for local database setup

## Core Functionalities

- User registration and login with JWT authentication
- Role-based access for citizens, employees, and administrators
- Incident ticket creation, update, deletion, and tracking
- Department-based classification for reported incidents
- Intervention team management with team members
- User administration and role management
- Ticket comments and operational updates
- Feedback form connected to the backend
- Email notification when a ticket is marked as resolved
- Search, pagination, and confirmation dialogs in the frontend

## Main Roles

- Citizen: submits tickets, tracks own reports, sends feedback
- Employee: works with assigned teams and operational tickets
- Admin: manages users, departments, teams, tickets, and follow-up requests

## Project Structure

- `backend` - Spring Boot API and business logic
- `frontend` - React user interface

## Outcome

CityAlert provides a complete incident reporting workflow, from citizen submission to administrative processing and intervention follow-up.
