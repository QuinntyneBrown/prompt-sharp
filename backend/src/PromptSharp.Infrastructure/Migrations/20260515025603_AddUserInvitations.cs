using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PromptSharp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserInvitations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserInvitations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(320)", maxLength: 320, nullable: false),
                    Roles = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InvitedBy = table.Column<string>(type: "nvarchar(320)", maxLength: 320, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    AcceptedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserInvitations", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserInvitations_CreatedAt",
                table: "UserInvitations",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_UserInvitations_Email",
                table: "UserInvitations",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserInvitations");
        }
    }
}
