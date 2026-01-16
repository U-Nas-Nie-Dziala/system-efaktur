import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Company } from "./Company";

@Entity({
    name: "ksef_sessions",
})
export class KsefSession {
    @PrimaryGeneratedColumn("uuid")
    id: string; // internal ID

    @Column({ type: "varchar", length: 256 })
    @Index()
    sessionReferenceNumber: string; // ksef session ID

    @Column({ type: "varchar" })
    sessionTimestamp: string;

    @Column({ type: "varchar" })
    sessionValidUntil: string;

    @Column({ type: "varchar", length: 6 })
    @Index()
    status: "OPEN" | "CLOSED";

    @Column({ type: "text", nullable: true })
    accessToken?: string;

    @Column({ type: "varchar", nullable: true })
    accessTokenExpiry?: string;

    @Column({ type: "text", nullable: true })
    refreshToken?: string;

    @Column({ type: "varchar", nullable: true })
    refreshTokenExpiry?: string;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @ManyToOne(() => Company, (c) => c.ksefSessions)
    company: Company;
}
