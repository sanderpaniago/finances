import { Stack } from "@chakra-ui/react";
import { RiDashboardLine, RiMoneyDollarCircleLine, RiApps2Line, RiLogoutBoxLine } from "react-icons/ri";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";
import { signOut } from 'next-auth/client'

export function SidebarNav() {
    return (
        <Stack spacing='12' align='flex-start'>
            <NavSection title='GERAL'>
                <NavLink href='/app/dashboard' icon={RiDashboardLine}>Dashboard</NavLink>
                <NavLink href='/app/transactions' icon={RiMoneyDollarCircleLine}>Transações</NavLink>
            </NavSection>

            <NavSection title='CONFIGURAÇÕES'>
                <NavLink href='/app/categories' icon={RiApps2Line} >Categorias</NavLink>
            </NavSection>

            <NavSection title='PERFIL'>
                <NavLink href='#!' onClick={() => signOut()} icon={RiLogoutBoxLine} >Sair</NavLink>
            </NavSection>
        </Stack>
    )
}