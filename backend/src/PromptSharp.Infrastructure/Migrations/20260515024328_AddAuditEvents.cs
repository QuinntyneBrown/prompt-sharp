using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PromptSharp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AuditEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Actor = table.Column<string>(type: "nvarchar(320)", maxLength: 320, nullable: false),
                    Action = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    TargetType = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    TargetId = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    TargetName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Before = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    After = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    ChangedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditEvents", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditEvents_Action",
                table: "AuditEvents",
                column: "Action");

            migrationBuilder.CreateIndex(
                name: "IX_AuditEvents_Actor",
                table: "AuditEvents",
                column: "Actor");

            migrationBuilder.CreateIndex(
                name: "IX_AuditEvents_ChangedAt",
                table: "AuditEvents",
                column: "ChangedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditEvents");
        }
    }
}
