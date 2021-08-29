import { Stack } from "@chakra-ui/react";
import { RiDashboardLine, RiMoneyDollarCircleLine, RiInputMethodLine, RiGitMergeLine } from "react-icons/ri";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SidebarNav() {
    return (
        <Stack spacing='12' align='flex-start'>
            <NavSection title='GERAL'>
                <NavLink href='/app/dashboard' icon={RiDashboardLine}>Dashboard</NavLink>
                <NavLink href='/app/transactions' icon={RiMoneyDollarCircleLine}>Transações</NavLink>
            </NavSection>

            {/* <NavSection title='AUTOMAÇÃO'>
                <NavLink href='/forms' icon={RiInputMethodLine} >Formulários</NavLink>
                <NavLink href='/automation' icon={RiGitMergeLine} >Automação</NavLink>
            </NavSection> */}
        </Stack>
    )
}